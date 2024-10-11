import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrder } from "../../../actions";
import Layout from "../../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Price from "../../../components/UI/Price";
import Rating from "../../../components/UI/Rating";

function CancelCheckout() {
  const params = useParams();
  const order = useSelector((state) => state.user.orderDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log(params);
    dispatch(getOrder({ orderId: params.orderId }));
  }, []);
  return (
    <Layout style={{ padding: "0", marginTop: "0" }}>
      <section className={"checkout-cancel-container"}>
        <h2>Order Cancelled</h2>
        <Link to="/cart">Return Cart </Link>
        <Link to="/">Return Home </Link>
      </section>
      <section className="products-section">
        <h2>Your orderned items</h2>
        {order.items &&
          order.items.map((item) => {
            return (
              <article className="product-container" key={item._id}>
                <picture className="product-img-container">
                  <img
                    src={item.productId.productPictures[0].imgUrl}
                    alt={`${item} image`}
                  />
                </picture>
                <div className="product-info">
                  <span>{item.productId.name}</span>
                  <div>
                    <p>Purchased: {item.purchasedQty} </p>
                  </div>

                  <Price value={item.payablePrice} />
                </div>
              </article>
            );
          })}
      </section>
    </Layout>
  );
}

export default CancelCheckout;
