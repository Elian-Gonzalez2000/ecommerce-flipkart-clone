import { homepageCardsConstants } from "../actions/constants";

const initialState = {
  groupOfCards: [],
  card: {},
  error: {},
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case homepageCardsConstants.GET_HOMEPAGECARDS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case homepageCardsConstants.GET_HOMEPAGECARDS_SUCCESS:
      state = {
        ...state,
        groupOfCards: action.payload.allCards,
        loading: false,
      };
      break;
    case homepageCardsConstants.GET_HOMEPAGECARDS_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case homepageCardsConstants.CREATE_HOMEPAGECARD_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case homepageCardsConstants.CREATE_HOMEPAGECARD_SUCCESS:
      state = {
        ...state,
        groupOfCards: [...groupOfCards, action.payload.createdCard],
        loading: false,
      };
      break;
    case homepageCardsConstants.CREATE_HOMEPAGECARD_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
  }
  return state;
};
