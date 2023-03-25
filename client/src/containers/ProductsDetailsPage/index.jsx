import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetailsById } from "../../actions";
import Layout from "../../components/Layout";

function ProductsDetailsPage(props) {
   const dispatch = useDispatch();
   const params = useParams();
   const product = useSelector((state) => state.product.productDetails);

   useEffect(() => {
      const payload = {
         params: {
            productId: params.productId,
         },
      };

      dispatch(getProductDetailsById(payload));
   }, []);

   return <Layout>{product.name}</Layout>;
}

export default ProductsDetailsPage;
