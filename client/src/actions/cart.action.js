import axios from "../helpers/axios";
import store from "../store";
import { cartConstants } from "./constants";

export const addToCart = (product) => {
   return async (dispatch) => {
      const { cartItems } = store.getState().cart;
      const quantity = cartItems[product._id]
         ? parseInt(cartItems[product._id].quantity + 1)
         : 1;

      cartItems[product._id] = {
         ...product,
         quantity,
      };

      localStorage.setItem("cart", JSON.stringify(cartItems));

      dispatch({
         type: cartConstants.ADD_TO_CART,
         payload: { cartItems },
      });
   };
};

export const updateToCart = () => {
   return async (dispatch) => {
      const cartItems = localStorage.getItem("cart")
         ? JSON.parse(localStorage.getItem("cart"))
         : null;

      if (cartItems) {
         dispatch({
            type: cartConstants.ADD_TO_CART,
            payload: { cartItems },
         });
      }
   };
};
