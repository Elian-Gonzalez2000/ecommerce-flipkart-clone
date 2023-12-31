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
            console.log({ getCartItems: cartItems });
            if (cartItems) {
               dispatch({
                  type: cartConstants.ADD_TO_CART_SUCCESS,
                  payload: { cartItems },
               });
            }
         }
      } catch (error) {
         console.log(error);
      }
   };
};

export const addToCart = (product, newQty = 1) => {
   return async (dispatch) => {
      const {
         cart: { cartItems },
         auth,
      } = store.getState();
      console.log(product);

      const quantity = cartItems[product._id]
         ? parseInt(cartItems[product._id].quantity + newQty)
         : 1;

      cartItems[product._id] = {
         ...product,
         quantity,
      };

      if (auth.authenticate) {
         dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
         const payload = {
            cartItems: [
               {
                  product: product._id,
                  quantity,
               },
            ],
         };
         console.log(payload);
         const res = await axios.post("/user/cart/addtocart", payload);
         console.log(res);
         if (res.status === 201) {
            dispatch(getCartItems());
         }
      } else {
         localStorage.setItem("cart", JSON.stringify(cartItems));
      }

      console.log("addToCart::", cartItems);
      dispatch({
         type: cartConstants.ADD_TO_CART_SUCCESS,
         payload: { cartItems },
      });
   };
};

export const removeCartItem = (payload) => {
   return async (dispatch) => {
      try {
         dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
         const res = await axios.post(`/user/cart/removeitem`, { payload });
         if (res.status === 202) {
            dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
            dispatch(getCartItems());
         } else {
            const { error } = res.data;
            dispatch({
               type: cartConstants.REMOVE_CART_ITEM_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
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
