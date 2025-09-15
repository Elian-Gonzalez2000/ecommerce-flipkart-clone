const Product = require("../../models/product.js");
const Homepage = require("../../models/homepage.js");
const Category = require("../../models/category.js");
const multer = require("multer");

const slugify = require("slugify");

const { log, error } = require("console");

exports.createHomepageCard = (req, res) => {
  const { productsList, category = req.body.categoryId, title } = req.body;
  if (productsList.length == 0)
    return res.status(400).json({ message: "The card need products" });
  if (!category)
    return res.status(400).json({ message: "The card need a category!" });
  if (!title)
    return res.status(400).json({ message: "The card need a title!" });

  // Primero eliminar si existe una tarjeta con el mismo título
  /* Homepage.deleteOne({ title: title.trim() }).exec((error, removed) => {
    console.log("Paso", error, removed);
    if (error) {
      console.error("Error al eliminar tarjeta existente:", error);
      // No retornamos aquí, continuamos con la creación
    }
    if (removed) {
      console.log("Tarjeta existente eliminada:", removed);
    }
  }); */

  // Continuar con la creación de la nueva tarjeta
  const homepageCardData = {
    title,
    products: [],
    category: {},
    createdBy: { _id: req.user._id, role: req.user.role },
  };

  const productsPromises = productsList.map((productId) => {
    return Product.findById(productId);
  });

  Promise.all(productsPromises)
    .then((results) => {
      if (!results)
        return res.status(400).json({ message: "Something was wrong" });

      results.forEach((productResult) => {
        homepageCardData.products.push({
          _id: productResult._id,
          img: productResult.productPictures[0].imgUrl,
          name: productResult.name,
        });
      });

      Category.findById(category).exec((error, cat) => {
        if (error)
          return res
            .status(400)
            .json({ message: "Something was wrong with category", error });

        if (cat) {
          homepageCardData.category = {
            _id: cat._id,
          };
        }

        if (!results && !cat)
          return res
            .status(400)
            .json({ message: "No products and category found" });
        if (!results)
          return res.status(400).json({ message: "No products found" });
        if (!cat) return res.status(400).json({ message: "No category found" });

        const createHomepageCard = new Homepage({ ...homepageCardData }, {});
        createHomepageCard.save((error, homepageCard) => {
          if (error) {
            if (error.code === 11000) {
              return res.status(400).json({
                message: "There is already a record with this unique data.",
                error,
              });
            }
            return res
              .status(400)
              .json({ message: "Something was wrong", error });
          }

          if (homepageCard) {
            return res
              .status(201)
              .json({ data: homepageCard, message: "Homepage card created" });
          }
        });
      });
    })
    .catch((error) => {
      if (error)
        return res.status(400).json({ message: "Something was wrong", error });
    });
};

exports.updateHomepageCard = (req, res) => {
  const { productId, category, user } = req.body;

  Product.findById(productId).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(200).json({ product });
  });
};

exports.deleteHomepageCard = (req, res) => {
  const { productId, category, user } = req.body;

  Product.findById(productId).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(200).json({ product });
  });
};

exports.getAllHomepagesCards = (req, res) => {
  Homepage.find({}).exec((error, homepages) => {
    if (error)
      return res.status(400).json({ message: "Something was wrong", error });

    if (homepages)
      return res.status(200).json({
        message: "All homepages cards obtained",
        data: [...homepages],
      });
  });
};

exports.getHomepageCard = (req, res) => {
  const { productId, category, user } = req.body;

  Product.findById(productId).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(200).json({ product });
  });
};
