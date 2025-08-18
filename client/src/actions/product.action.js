import axios from "../helpers/axios";
import { productConstants } from "./constants";

export const getProductsBySlug = (slug) => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCTS_BY_SLUG_REQUEST });
      const res = await axios.post(`/products/${slug}`);
      console.log(res);
      if (res.status === 200) {
        dispatch({
          type: productConstants.GET_PRODUCTS_BY_SLUG,
          payload: res.data,
        });
      }
    } catch (err) {
      const { status, data } = err.response;
      console.log(err.response);
      if (status === 400) {
        dispatch({
          type: productConstants.GET_PRODUCTS_BY_SLUG_FAILURE,
          payload: { error: data },
        });
      }
    }
  };
};

export const getProductPage = (payload) => {
  return async (dispatch) => {
    try {
      //console.log("paylaod", payload);
      const { cid, type } = payload;
      const res = await axios.get(`/page/${cid}/${type}`);
      //console.log(res);
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

export const getProductBySearchQuery = (query) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_PRODUCTS_BY_SEARCH_QUERY_REQUEST });
    try {
      const res = await axios.get(
        `/products/getproductsbyquery?query=${query}`
      );
      console.log(res);
      if (res.status == 200) {
        dispatch({
          type: productConstants.GET_PRODUCTS_BY_SEARCH_QUERY_SUCCESS,
          payload: { products: res.data.products },
        });
      }
    } catch (error) {
      //console.log(error.response);
      if (error.response.status == 400) {
        const { status, data } = error.response;
        dispatch({
          type: productConstants.GET_PRODUCTS_BY_SEARCH_QUERY_FAILURE,
          payload: { error: data },
        });
      }
    }
  };
};
