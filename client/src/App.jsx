import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { isUserLoggedIn, updateToCart } from "./actions";
import "./App.css";
import HomePage from "./containers/HomePage";
import ProductListPage from "./containers/ProductListPage";
import ProductsDetailsPage from "./containers/ProductsDetailsPage";
import CartPage from "./containers/CartPage";
import CheckoutPage from "./containers/CheckoutPage";
import OrderPage from "./containers/OrderPage";
import OrderDetailsPage from "./containers/OrderDetailsPage";
import SuccessCheckout from "./containers/CheckoutPage/CheckoutResults/Success";
import CancelCheckout from "./containers/CheckoutPage/CheckoutResults/Cancel";
import Error from "./containers/Signup/Error";
import Confirm from "./containers/Signup/Confirm";
import { Helmet } from "react-helmet";

function App() {
  const url = "http://localhost:3002/api/admin/signin";
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
  }, [auth.authenticate]);

  useEffect(() => {
    dispatch(updateToCart());
  }, []);

  return (
    <main className="App">
      <Helmet>
        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/general%2Fflipkart-metatags.png?alt=media&token=ae918f5a-699d-4b31-8963-ba9b6e2a4167"
        />
        <meta
          property="og:description"
          content="Online Shopping India Mobile, Cameras, Lifestyle &amp; more Online @ Flipkart.com"
        />

        <meta
          name="twitter:description"
          content="Online Shopping India Mobile, Cameras, Lifestyle &amp; more Online @ Flipkart.com"
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/general%2Fflipkart-metatags.png?alt=media&token=ae918f5a-699d-4b31-8963-ba9b6e2a4167"
        />
        <link
          rel="canonical"
          href="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/"
        />
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account/orders" element={<OrderPage />} />
          <Route
            path="/order-details/:orderId"
            element={<OrderDetailsPage />}
          />
          <Route
            path="/:productSlug/:productId/p"
            exact
            element={<ProductsDetailsPage />}
          />
          <Route path="/:slug" exact element={<ProductListPage />} />
          <Route
            path="/checkout/success/:orderId"
            exact
            element={<SuccessCheckout />}
          />
          <Route
            path="/checkout/cancel/:orderId"
            exact
            element={<CancelCheckout />}
          />
          <Route path="/signup/user/error/:error" exact element={<Error />} />
          <Route path="/signup/user/success" exact element={<Confirm />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
