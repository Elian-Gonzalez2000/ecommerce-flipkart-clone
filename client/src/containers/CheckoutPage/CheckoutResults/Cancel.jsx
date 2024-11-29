import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteOrder } from "../../../actions";
import Layout from "../../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Price from "../../../components/UI/Price";
import { Link } from "react-router-dom";
import { BsArrowBarLeft } from "react-icons/bs";

function CancelCheckout() {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log(params);
    dispatch(deleteOrder({ orderId: params.orderId }));
  }, []);
  return (
    <Layout style={{ padding: "0", marginTop: "0" }}>
      <section className={"checkout-cancel-container"}>
        <h2>Order Cancelled</h2>
        <Link to="/cart">
          <BsArrowBarLeft /> {"  "} Return Cart{" "}
        </Link>

        <Link to="/">
          <BsArrowBarLeft /> {"  "}Return Home{" "}
        </Link>
      </section>
    </Layout>
  );
}

export default CancelCheckout;
