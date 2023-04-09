import categoryReducer from "./category.reducer";
import productReducer from "./product.reducer";
import authReducer from "./auth.reducer";
import cartReducer from "./cart.reducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
   auth: authReducer,
   category: categoryReducer,
   product: productReducer,
   cart: cartReducer,
});

export default rootReducer;
