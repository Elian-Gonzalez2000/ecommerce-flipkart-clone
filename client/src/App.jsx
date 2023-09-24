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

function App() {
   const url = "http://localhost:3002/api/admin/signin";
   // const data = {
   //    /*       firstName: "Edwiin",
   //    lastName: "Gonzalez", */
   //    /* email: "eliancarlogm@gmail.com",
   //    password: "123456789", */
   //    //name: "Electronics",
   //    //parentId: "627b1a44874b7eba250c33d8",
   // };
   // fetch(url, {
   //    method: "POST",
   //    body: JSON.stringify({
   //       email: "eswin@gmail.com",
   //       password: "123456789",
   //    }),
   //    headers: {
   //       "Content-Type": "application/json",
   //    },
   // })
   //    .then((res) => res.json())
   //    .then((data) => {
   //       console.log(data);
   //       if (data?.token) {
   //          console.log(data.token);
   //          fetch("http://localhost:3002/api/category/create", {
   //             method: "POST",
   //             body: JSON.stringify({ name: "Sports" }),
   //             headers: {
   //                "Content-Type": "application/json",
   //                authorization:
   //                   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdiMWE0NDg3NGI3ZWJhMjUwYzMzZDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTIyMzUxNzQsImV4cCI6MTY1MjI0MjM3NH0.EfNoWqYCmu210ryhnQcXSAau3e3lUwLMDBqiq9ZUp9o",
   //             },
   //          })
   //             .then((res) => res.json())
   //             .then((data) => console.log(data))
   //             .catch((err) => console.log(err));
   //       }
   //    })
   //    .catch((error) => console.log(error));

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
      <div className="App">
         <Router>
            <Routes>
               <Route path="/" exact element={<HomePage />} />
               <Route path="/cart" element={<CartPage />} />
               <Route path="/checkout" element={<CheckoutPage />} />
               <Route path="/account/orders" element={<OrderPage />} />
               <Route
                  path="/:productSlug/:productId/p"
                  exact
                  element={<ProductsDetailsPage />}
               />
               <Route path="/:slug" exact element={<ProductListPage />} />
            </Routes>
         </Router>
      </div>
   );
}

export default App;
