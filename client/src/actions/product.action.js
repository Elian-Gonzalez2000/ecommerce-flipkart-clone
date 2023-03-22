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
