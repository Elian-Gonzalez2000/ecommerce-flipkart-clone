import { productConstants } from "../actions/constants";

const initialState = {
  products: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case productConstants.GET_ALL_PRODUCTS_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
      };
      break;

    case productConstants.EDIT_PRODUCT_SUCCESS:
      state = {
        ...state,
        // products: action.payload.data.products,
      };
      break;
  }
  return state;
};
