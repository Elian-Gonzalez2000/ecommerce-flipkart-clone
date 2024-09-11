import React from "react";
import loader from "./loader.svg";

const Loader = () => {
  return (
    <div className="container-loader">
      <img src={loader} alt="Loading..." />
    </div>
  );
};

export default Loader;
