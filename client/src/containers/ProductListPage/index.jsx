import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import ProductStore from "./ProductStore/index.jsx";
import ProductPage from "./ProductPage/index.jsx";
import "./styles.css";
import getParams from "../../utilities/getParams";

const ProductListPage = (props) => {
   const location = useLocation();
   const renderProduct = () => {
      const params = getParams(location.search);
      console.log(location, params);
      let content = null;
      switch (params.type) {
         case "store":
            content = <ProductStore {...props} location={location} />;
            break;
         case "page":
            content = <ProductPage {...props} location={location} />;
            break;
         default:
            content = null;
      }
      return content;
   };
   return <Layout>{renderProduct()}</Layout>;
};

export default ProductListPage;
