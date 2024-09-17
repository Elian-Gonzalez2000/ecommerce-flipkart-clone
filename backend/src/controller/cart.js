const Cart = require("../models/cart");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });

    let promiseArray = [];

    if (cart) {
      // Si el carrito ya existe, actualiza la cantidad
      if (req.body?.updateToCart) {
        req.body.cartItems.forEach((cartItem) => {
          const product = cartItem.product;
          const item = cart.cartItems.find((c) => c.product == product);

          let condition, update;
          if (item) {
            condition = { user: req.user._id, "cartItems.product": product };
            update = {
              $set: {
                "cartItems.$": {
                  ...cartItem,
                  quantity: cartItem.quantity + item.quantity,
                },
              },
            };
          } else {
            condition = { user: req.user._id };
            update = {
              $push: {
                cartItems: cartItem,
              },
            };
          }

          promiseArray.push(runUpdate(condition, update));
        });
      }

      // Procesa el caso normal (sin updateToCart)
      if (!req.body?.updateToCart) {
        req.body.cartItems.forEach((cartItem) => {
          const product = cartItem.product;
          const item = cart.cartItems.find((c) => c.product == product);
          let condition, update;

          if (item) {
            condition = { user: req.user._id, "cartItems.product": product };
            update = {
              $set: {
                "cartItems.$": cartItem,
              },
            };
          } else {
            condition = { user: req.user._id };
            update = {
              $push: {
                cartItems: cartItem,
              },
            };
          }

          promiseArray.push(runUpdate(condition, update));
        });
      }
      // Aquí aseguramos que se resuelvan todas las promesas antes de enviar la respuesta
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      // Si el carrito no existe, crea uno nuevo
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems, // Cambié `cardItems` a `cartItems`
      });

      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(201).json({ cart });
        }
      });
    }
  });
};

exports.getCartItems = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          // console.log(item);
          const cartImg = item.product.productPictures[0];
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            cartItemImg: cartImg,
            price: item.product.price,
            quantity: item.quantity,
          };
        });
        res.status(200).json({ cartItems });
      }
    });
};

exports.removeCartItems = (req, res) => {
  const { productId } = req.body.payload;
  if (productId && req?.user._id) {
    Cart.update(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
