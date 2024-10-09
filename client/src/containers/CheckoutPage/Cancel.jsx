import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrder } from "../../actions";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";

function CancelCheckout() {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log(params);
    dispatch(getOrder({ orderId: params.orderId }));
  }, []);
  return (
    <Layout>
      <div className="checkout-cancel-container"></div>
    </Layout>
  );
}

export default CancelCheckout;
