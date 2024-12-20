import { productConstants } from "../actions/constants";

const initialState = {
   products: [],
   productDetails: {},
   productsByPrice: {
      under5k: [],
      under10k: [],
      under15k: [],
      under20k: [],
      under30k: [],
   },
   priceRange: {},
   pageRequest: false,
   loading: false,
   page: {},
   error: null,
};

export default (state = initialState, action) => {
   switch (action.type) {
      case productConstants.GET_PRODUCTS_BY_SLUG_REQUEST:
         state = {
            ...state,
            loading: true,
         };
         break;

      case productConstants.GET_PRODUCTS_BY_SLUG:
         state = {
            ...state,
            products: action.payload.products,
            priceRange: action.payload.priceRange,
            productsByPrice: {
               ...action.payload.productsByPrice,
            },
            loading: false,
         };
         break;

      case productConstants.GET_PRODUCTS_BY_SLUG_FAILURE:
         state = {
            ...state,
            loading: false,
            error: action.payload.error,
         };
         break;
      case productConstants.GET_PRODUCTS_PAGE_REQUEST:
         state = {
            ...state,
            pageRequest: true,
         };
         break;
      case productConstants.GET_PRODUCTS_PAGE_SUCCESS:
         state = {
            ...state,
            pageRequest: false,
            page: action.payload.page,
         };
         break;
      case productConstants.GET_PRODUCTS_PAGE_FAILURE:
         state = {
            ...state,
            pageRequest: false,
            error: action.payload.error,
         };
         break;
      case productConstants.GET_PRODUCT_DETAILS_BY_ID_REQUEST:
         state = {
            ...state,
            loading: true,
         };
         break;
      case productConstants.GET_PRODUCT_DETAILS_BY_ID_SUCCESS:
         state = {
            ...state,
            loading: false,
            productDetails: action.payload.productDetails,
         };
         break;
      case productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE:
         state = {
            ...state,
            loading: false,
            error: action.payload.error,
         };
         break;
   }

   return { ...state };
};
