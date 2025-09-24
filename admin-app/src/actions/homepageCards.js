import axios from "../helpers/axios.js";
import { homepageCardsConstants } from "./constants.js";

export const createHomepageCard = (formData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: homepageCardsConstants.CREATE_HOMEPAGECARD_REQUEST });
      const res = await axios.post("admin/homepagecard/create", {
        ...formData,
        productsList: formData.products,
      });

      if (res.status === 201) {
        dispatch({
          type: homepageCardsConstants.CREATE_HOMEPAGECARD_SUCCESS,
          payload: res.data.data,
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log(error);
        dispatch({
          type: homepageCardsConstants.CREATE_HOMEPAGECARD_FAILURE,
          payload: error.response,
        });
      }
    }
  };
};

export const updateHomepageCard = (formData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: homepageCardsConstants.UPDATE_HOMEPAGECARD_REQUEST });
      const res = await axios.post("admin/homepagecard/create", {
        ...formData,
        productsList: formData.products,
      });

      if (res.status === 201) {
        dispatch({
          type: homepageCardsConstants.UPDATE_HOMEPAGECARD_SUCCESS,
          payload: res.data.data,
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log(error);
        dispatch({
          type: homepageCardsConstants.UPDATE_HOMEPAGECARD_FAILURE,
          payload: error.response,
        });
      }
    }
  };
};

export const getAllCardsHomepages = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: homepageCardsConstants.GET_HOMEPAGECARDS_REQUEST });
      const res = await axios.get("admin/homepagecard/getall");
      if (res.status === 200) {
        dispatch({
          type: homepageCardsConstants.GET_HOMEPAGECARDS_SUCCESS,
          payload: { allCards: res.data.allCards },
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        dispatch({
          type: homepageCardsConstants.GET_HOMEPAGECARDS_FAILURE,
          payload: error.response,
        });
      }
    }
  };
};
