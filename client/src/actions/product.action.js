import axios from "../helpers/axios";
import { productConstants } from "./constants";

export const getProductsBySlug = (slug) => {
   return async (dispatch) => {
      try {
         const res = await axios.post(`/products/${slug}`);
         console.log(res);
         if (res.status === 200) {
            dispatch({
               type: productConstants.GET_PRODUCTS_BY_SLUG,
               payload: res.data,
            });
         }
      } catch (err) {
         console.log(err);
      }
   };
};

export const getProductPage = (payload) => {
   return async (dispatch) => {
      try {
         console.log("paylaod", payload);
         const { cid, type } = payload;
         const res = await axios.get(`/page/${cid}/${type}`);
         console.log(res);
         dispatch({ type: productConstants.GET_PRODUCTS_PAGE_REQUEST });
         if (res.status === 200) {
            const { page } = res.data;
            dispatch({
               type: productConstants.GET_PRODUCTS_PAGE_SUCCESS,
               payload: { page },
            });
         }
      } catch (err) {
         const { status, data } = err.response;
         console.log(err.response);
         if (status === 400) {
            dispatch({
               type: productConstants.GET_PRODUCTS_PAGE_FAILURE,
               payload: { error: data },
            });
         }
      }
   };
};

export const getProductDetailsById = (payload) => {
   return async (dispatch) => {
      dispatch({ type: productConstants.GET_PRODUCT_DETAILS_BY_ID_REQUEST });
      try {
         const { productId } = payload.params;
         const res = await axios.get(`/product/${productId}`);
         console.log(res);
         dispatch({
            type: productConstants.GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
            payload: { productDetails: res.data.product },
         });
      } catch (error) {
         console.log(error.response);
         const { status, data } = error.response;
         dispatch({
            type: productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE,
            payload: { error: data },
         });
      }
   };
};
