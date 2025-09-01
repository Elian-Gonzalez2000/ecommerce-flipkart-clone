import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./containers/Home";
import Signin from "./containers/Signin";
import Signup from "./containers/Signup";
import PrivateRoute from "./components/HOC/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { isUserLoggedIn, getInitialData } from "./actions";
import Products from "./containers/Products";
import Orders from "./containers/Orders";
import Category from "./containers/Category";
import NewPage from "./containers/NewPage";
import SignupConfirm from "./containers/Signup/confirm";
import SignupError from "./containers/Signup/error";
import Homepage from "./containers/Homepage";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, []);
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
    if (auth.authenticate) {
      dispatch(getInitialData());
    }
  }, [auth.authenticate]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<PrivateRoute component={Home} />} />
        <Route
          path="/homepage"
          exact
          element={<PrivateRoute component={Homepage} />}
        />
        <Route path="/page" element={<PrivateRoute component={NewPage} />} />
        <Route
          path="/products"
          element={<PrivateRoute component={Products} />}
        />
        <Route path="/orders" element={<PrivateRoute component={Orders} />} />
        <Route
          path="/categories"
          element={<PrivateRoute component={Category} />}
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/admin/confirm" element={<SignupConfirm />} />
        <Route path="/signup/admin/error/:error" element={<SignupError />} />
      </Routes>
    </div>
  );
}

export default App;
