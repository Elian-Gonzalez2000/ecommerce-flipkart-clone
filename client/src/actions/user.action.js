import { cartConstants, userConstants } from "./constants";
import axios from "../helpers/axios";

export const getAddress = () => {
   return async (dispatch) => {
      try {
         const res = await axios.post("/user/getaddress");
         dispatch({ type: userConstants.GET_USER_ADDRESS_REQUEST });
         console.log(res);
         if (res.status === 200) {
            const {
               userAddress: { address },
            } = res.data;
            dispatch({
               type: userConstants.GET_USER_ADDRESS_SUCCESS,
               payload: { address },
            });
         } else {
            const { error } = res.data;
            dispatch({
               type: userConstants.GET_USER_ADDRESS_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
      }
   };
};

export const addAddress = (payload) => {
   return async (dispatch) => {
      try {
         const res = await axios.post("/user/address/create", { payload });
         dispatch({ type: userConstants.ADD_USER_ADDRESS_REQUEST });
         if (res.status === 201) {
            console.log(res);
            const {
               address: { address },
            } = res.data;
            dispatch({
               type: userConstants.ADD_USER_ADDRESS_SUCCESS,
               payload: { address },
            });
         } else {
            const { error } = res.data;
            dispatch({
               type: userConstants.ADD_USER_ADDRESS_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
      }
   };
};

export const addOrder = (payload) => {
   return async (dispatch) => {
      try {
         const res = await axios.post(`/add-order`, payload);
         dispatch({ type: userConstants.ADD_USER_ORDER_REQUEST });
         if (res.status === 201) {
            console.log(res);
            dispatch({ type: cartConstants.RESET_CART });
            // const {
            //   address: { address },
            // } = res.data;
            // dispatch({
            //   type: userConstants.ADD_USER_ADDRESS_SUCCESS,
            //   payload: { address },
            // });
         } else {
            const { error } = res.data;
            dispatch({
               type: userConstants.ADD_USER_ORDER_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
      }
   };
};

export const getOrders = () => {
   return async (dispatch) => {
      try {
         const res = await axios.get(`/get-orders`);
         dispatch({ type: userConstants.GET_USER_ORDER_REQUEST });
         console.log(res);
         const { orders } = res.data;
         if (res.status === 200) {
            dispatch({
               type: userConstants.GET_USER_ORDER_SUCCESS,
               payload: { orders },
            });
         } else {
            const { error } = res.data;
            dispatch({
               type: userConstants.GET_USER_ORDER_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
      }
   };
};

// single order with complete info and delivery location
export const getOrder = (payload) => {
   return async (dispatch) => {
      try {
         const res = await axios.post(`/get-order`, payload);
         dispatch({ type: userConstants.GET_USER_ORDER_DETAILS_REQUEST });
         if (res.status === 200) {
            console.log(res);
            const { order } = res.data;
            dispatch({
               type: userConstants.GET_USER_ORDER_DETAILS_SUCCESS,
               payload: { order },
            });
         } else {
            const { error } = res.data;
            dispatch({
               type: userConstants.GET_USER_ORDER_DETAILS_FAILURE,
               payload: { error },
            });
         }
      } catch (error) {
         console.log(error);
      }
   };
};
