import { authConstants, cartConstants } from "./constants";
import axios from "../helpers/axios.js";
import { updateToCart } from "./cart.action.js";

// new update signup action
export const signup = (user) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.SIGNUP_REQUEST });
      const res = await axios.post(`/signup`, user);
      if (res.status === 201) {
        dispatch({ type: authConstants.SIGNUP_SUCCESS });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
      } else {
        const { error } = res.data;
        dispatch({
          type: authConstants.SIGNUP_FAILURE,
          payload: { error },
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 400) {
        const { data } = error.response;
        dispatch({
          type: authConstants.SIGNUP_FAILURE,
          payload: { error: data.error },
        });
      }
    }
  };
};

export const login = (user) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGIN_REQUEST });
      const res = await axios.post("/signin", {
        ...user,
      });
      if (res.status === 200) {
        /* Take the token and user from the response, then save in localStorage with setItem, this permite use the token easly in the application */
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: { token, user },
        });
        // Necesito Actualizar el quantity del carrito del backend antes de añadir el carrito guardado en local storage
        dispatch(updateToCart());
      }
    } catch (error) {
      if (error.response?.status === 400) {
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: { error: error.response.data.message },
        });
      }
    }
  };
};

export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "Fail to login" },
      });
    }
  };
};

export const signout = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });
    //const res = await axios.post("/signout");
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");
    localStorage.clear();
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
    dispatch({ type: cartConstants.RESET_CART });

    /* if (res.status === 200) {
         localStorage.clear();
         dispatch({
            type: authConstants.LOGOUT_SUCCESS,
         });
      } else {
         dispatch({
            type: authConstants.LOGOUT_FAILURE,
            payload: { error: res.data.error },
         });
      } */
  };
};
