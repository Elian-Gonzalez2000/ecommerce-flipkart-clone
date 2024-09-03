import { authConstants, userConstants } from "./constants";
import axios from "../helpers/axios.js";

export const signup = (user) => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.USER_REGISTER_REQUEST });
      const res = await axios.post("/admin/signup", {
        ...user,
      });
      //console.log(res);
      if (res.status === 201) {
        const { message } = res.data;
        dispatch({
          type: userConstants.USER_REGISTER_SUCCESS,
          payload: { message },
        });
      }
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400) {
        console.log(error);
        dispatch({
          type: userConstants.USER_REGISTER_FAILURE,
          payload: { error: data },
        });
      }
    }

    dispatch({
      type: authConstants.LOGIN_REQUEST,
      payload: {
        ...user,
      },
    });
  };
};
