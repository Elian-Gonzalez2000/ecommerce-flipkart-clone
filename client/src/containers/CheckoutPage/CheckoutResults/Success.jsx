import React, { useEffect } from "react";
import Layout from "../../../components/Layout";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, resetCart } from "../../../actions";
import Price from "../../../components/UI/Price";
import { Link } from "react-router-dom";

function SuccessCheckout() {
  const params = useParams();
  const order = useSelector((state) => state.user.orderDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log(params);
    dispatch(getOrder({ orderId: params.orderId }));
    dispatch(resetCart());
  }, []);
  return (
    <Layout style={{ padding: "0", marginTop: "0" }}>
      <section className={"checkout-success-container"}>
        <h2>Order Placed</h2>
        <p style={{ fontSize: "1.1rem" }}>
          Total price for {order.items && order.items.length} items{" "}
          {<Price value={order.totalAmount} />}
        </p>
        <Link
          style={{ color: "var(--text-light-color)", fontSize: "1.1rem" }}
          to={`/order-details/${params.orderId}`}
        >
          View details{" "}
        </Link>
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

export default SuccessCheckout;
