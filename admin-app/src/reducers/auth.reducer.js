import { authConstants } from "../actions/constants";

const initialState = {
  token: null,
  user: {
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
  },
  authenticate: false,
  authenticating: false,
  loading: false,
  error: null,
  message: "",
};

export default (state = initialState, action) => {
  //console.log(action);
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
        loading: true,
        error: null,
      };
      break;

    case authConstants.LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
        loading: false,
        error: null,
        message: "",
      };
      break;

    case authConstants.LOGIN_FAILURE:
      state = {
        ...state,
        error: action.payload.error ? action.payload.error : null,
        message: action.payload.message ? action.payload.message : "",
        authenticate: false,
        authenticating: false,
        loading: false,
      };
      break;

    case authConstants.LOGOUT_REQUEST:
      state = {
        ...initialState,
        loading: true,
      };
      break;

    case authConstants.LOGOUT_SUCCESS:
      state = {
        ...initialState,
      };
      break;

    case authConstants.LOGOUT_FAILURE:
      state = {
        ...initialState,
        error: action.payload.error,
        loading: false,
      };
      break;
  }
  return state;
};
