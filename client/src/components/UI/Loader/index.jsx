import React from "react";
import loader from "./loader.svg";

const Loader = () => {
   console.log("laoding...");
   return (
      <div className="container-loader">
         <img src={loader} alt="Loading..." />
      </div>
   );
};

export default Loader;
