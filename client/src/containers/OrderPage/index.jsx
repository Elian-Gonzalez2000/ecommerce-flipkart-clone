import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    auth.authenticate && dispatch(getOrders());
    if (!auth.authenticate && !auth.authenticating) navigate("/");
  }, [auth.authenticate]);

  return (
    <Layout>
      <Helmet>
        <title>{"Flipkart.com Clone: Payment Orders"}</title>
        <meta
          property="og:title"
          content="Shopping Cart | Flipkart.com Clone"
        />
        <meta
          property="og:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${params.productSlug}/${params.productId}/p`}
        />
        <meta
          name="twitter:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${params.productSlug}/${params.productId}/p`}
        />
        <meta
          name="twitter:title"
          content={`${params.productSlug} | Flipkart.com Clone`}
        />
      </Helmet>
      <div>
        <Breed
          breed={[
            { name: "Home", href: "/" },
            { name: "My Account", href: "/account" },
            { name: "My Orders", href: "/account/orders" },
          ]}
          breedIcon={<IoIosArrowForward />}
        />
        <div style={{ marginTop: "1rem", minHeight: "100px" }}>
          {user.orders.length > 0 ? (
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
            })
          ) : (
            <Card
              key={randomUI()}
              header={false}
              style={{ width: "99%", margin: "1rem auto", minHeight: "100px" }}
            >
              <p>No orders</p>
            </Card>
          )}
        </div>
        <div className="no-more-orders">
          <p>No more orders</p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
