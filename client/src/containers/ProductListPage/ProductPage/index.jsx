import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductPage } from "../../../actions";
import getParams from "../../../utilities/getParams";

function ProductPage(props) {
   const dispatch = useDispatch();
   const product = useSelector((state) => state.product);

   useEffect(() => {
      const params = getParams(props.location.search);
      const paylaod = {
         params,
      };
      dispatch(getProductPage(params));
   }, []);

   return (
      <>
         <h1>page</h1>
      </>
   );
}

export default ProductPage;
