import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./containers/Home";
import Signin from "./containers/Signin";
import Signup from "./containers/Signup";

function App() {
   /* const url = "http://localhost:3002/api/admin/signup";
   const data = {
      firstName: "Eliangelica",
      lastName: "Gonzalez Marcano",
      email: "eliangelicagm@gmail.com",
      password: "123456789",
   };
   fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Content-Type": "application/json",
      },
   })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error)); */

   return (
      <div className="App">
         <Router>
            <Routes>
               <Route path="/" exact element={<Home />} />
               <Route path="/signin" element={<Signin />} />
               <Route path="/signup" element={<Signup />} />
            </Routes>
         </Router>
      </div>
   );
}

export default App;
