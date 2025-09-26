import { homepageCardsConstants } from "../actions/constants";

const initialState = {
  groupOfCards: [],
  card: {},
  error: {},
  loading: false,
};

const updatedGroupOfCards = (groupCardsList, addCardUpdated) => {
  if (!Array.isArray(groupCardsList)) {
    console.log("first argument must be an array");
    return [];
  }

  if (
    !addCardUpdated?.title ||
    !addCardUpdated.category ||
    !addCardUpdated.products
  ) {
    console.log("second argument must have the correct object data");
    return [];
  }

  const groupOfCardsUpdated = groupCardsList.filter(
    (card) => card._id !== addCardUpdated._id
  );

  return [...groupOfCardsUpdated, addCardUpdated];
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
    case homepageCardsConstants.UPDATE_HOMEPAGECARD_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case homepageCardsConstants.UPDATE_HOMEPAGECARD_SUCCESS:
      const cardUpdated = action.payload.updatedCard;
      const saveUpdatedGroupOfCards = updatedGroupOfCards(
        [...state.groupOfCards],
        cardUpdated
      );

      state = {
        ...state,
        groupOfCards: saveUpdatedGroupOfCards,
        loading: false,
      };
      break;
    case homepageCardsConstants.UPDATE_HOMEPAGECARD_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
  }
  return state;
};
