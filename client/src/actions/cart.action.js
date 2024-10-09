import axios from "../helpers/axios";
import store from "../store";
import { cartConstants } from "./constants";

const getCartItems = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const res = await axios.post("/user/getcartitems");
      if (res.status === 200) {
        const { cartItems } = res.data;
        console.log("Carrito GET: ", { getCartItems: cartItems });
        if (cartItems) {
          dispatch({
            type: cartConstants.ADD_TO_CART_SUCCESS,
            payload: { cartItems },
          });
        }
      }
    } catch (error) {
      console.log(error);
      const { status, data } = error.response;
      if (status === 400) {
        dispatch({
          type: cartConstants.ADD_TO_CART_FAILURE,
          payload: { error: data },
        });
      }
    }
  };
};

export const addToCart = (product, newQty = 1) => {
  return async (dispatch) => {
    const {
      cart: { cartItems },
      auth,
    } = store.getState();

    // Verificar si cartItems es null o undefined y si es así, inicializarlo como un objeto vacío
    const updatedCartItems = cartItems ? { ...cartItems } : {};

    console.log(updatedCartItems, "productos:  ", product);

    // Si el producto no existe en el carrito, agregarlo, si existe actualizar la cantidad
    updatedCartItems[product._id] = {
      ...product,
      quantity: updatedCartItems[product._id]
        ? parseInt(updatedCartItems[product._id].quantity + newQty)
        : newQty,
    };

    if (auth.authenticate) {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const payload = {
        cartItems: [
          {
            product: product._id,
            quantity: updatedCartItems[product._id].quantity,
          },
        ],
      };
      const res = await axios.post("/user/cart/addtocart", payload);
      console.log(res);
      if (res.status === 201) {
        dispatch(getCartItems());
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }

    //console.log("addToCart::", updatedCartItems);
    dispatch({
      type: cartConstants.ADD_TO_CART_SUCCESS,
      payload: { cartItems: updatedCartItems },
    });
  };
};

export const removeCartItem = (payload) => {
  return async (dispatch) => {
    try {
      const { auth } = store.getState();
      dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
      if (auth.authenticate) {
        const res = await axios.post(`/user/cart/removeitem`, { payload });
        if (res.status === 202) {
          dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
          dispatch(getCartItems());
        }
      } else {
        const cartLocalStorage = JSON.parse(localStorage.getItem("cart"));
        const updatedCart = Object.values(cartLocalStorage).filter(
          (item) => item._id !== payload.productId
        );
        console.log(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch({
          type: cartConstants.REMOVE_CART_ITEM_SUCCESS,
          payload: { cartItems: updatedCart },
        });
      }
    } catch (error) {
      if (error.response?.status == 400) {
        const { status, data } = error.response;
        dispatch({
          type: cartConstants.REMOVE_CART_ITEM_FAILURE,
          payload: { data },
        });
      }
    }
  };
};

export const updateToCart = () => {
  return async (dispatch) => {
    const { auth } = store.getState();
    const cartItems = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;

    if (auth.authenticate) {
      localStorage.removeItem("cart");
      if (cartItems) {
        const payload = {
          cartItems: Object.keys(cartItems).map((key, index) => {
            return {
              quantity: cartItems[key].quantity,
              product: cartItems[key]._id,
            };
          }),
          updateToCart: true,
        };
        if (Object.keys(cartItems).length > 0) {
          const res = await axios.post("/user/cart/addtocart", payload);
          if (res.status === 201) {
            dispatch(getCartItems());
          }
        }
      } else {
        dispatch(getCartItems());
      }
    } else {
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems },
      });
    }
  };
};

export { getCartItems };
