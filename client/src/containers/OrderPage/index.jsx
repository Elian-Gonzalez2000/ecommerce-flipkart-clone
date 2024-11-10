import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { genericPublicUrl } from "../../urlConfig";
import { randomUI } from "../../helpers/randomUI";
import { getOrders } from "../../actions";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { Breed } from "../../components/MaterialUI";
import "./style.css";
import Price from "../../components/UI/Price";
import { IoIosArrowForward } from "react-icons/io";

const OrderPage = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  return (
    <Layout>
      <div>
        <Breed
          breed={[
            { name: "Home", href: "/" },
            { name: "My Account", href: "/account" },
            { name: "My Orders", href: "/account/orders" },
          ]}
          breedIcon={<IoIosArrowForward />}
        />
        <div style={{ marginTop: "1rem" }}>
          {user.orders.length > 0 &&
            user.orders.map((order) => {
              return order.items.map((item) => (
                <Card
                  key={randomUI()}
                  header={false}
                  style={{ width: "99%", margin: "1rem auto" }}
                >
                  <Link
                    to={`/order-details/${order._id}`}
                    className="order-item-container"
                  >
                    {/* {console.log(item)} */}
                    <div className="order-item-details">
                      <picture>
                        <img
                          src={item.productId.productPictures[0].imgUrl}
                          alt={item.productId.name}
                        />
                      </picture>
                      <p className="order-item-name">{item.productId.name}</p>
                      <p>
                        {
                          <Price
                            value={item.payablePrice * item.purchasedQty}
                          />
                        }
                      </p>
                      <p
                        className={`order-item-status ${
                          order?.paymentStatus && order.paymentStatus
                        }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                  </Link>
                </Card>
              ));
            })}
        </div>
        <div className="no-more-orders">
          <p>No more orders</p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
