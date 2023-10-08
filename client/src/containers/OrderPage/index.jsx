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
            />
            {user.orders.length > 0 &&
               user.orders.map((order) => {
                  return order.items.map((item) => (
                     <Card
                        key={randomUI()}
                        style={{ display: "block", margin: "5px 0" }}
                     >
                        <Link
                           to={`/order-details/${order._id}`}
                           className="orderItemContainer"
                        >
                           <div
                              style={{
                                 display: "flex",
                                 flex: "1",
                                 justifyContent: "space-between",
                              }}
                           >
                              <picture
                                 style={{
                                    width: "80px",
                                    height: "80px",
                                    overflow: "hidden",
                                    textAlign: "center",
                                 }}
                              >
                                 <img
                                    style={{
                                       maxWidth: "80px",
                                       maxHeight: "80px",
                                    }}
                                    src={genericPublicUrl(
                                       item.productId.productPictures[0].img
                                    )}
                                 />
                              </picture>
                              <p style={{ width: "300px" }}>
                                 {item.productId.name}
                              </p>
                              <p>{item.payablePrice}</p>
                              <p>{order.paymentStatus}</p>
                           </div>
                        </Link>
                     </Card>
                  ));
               })}
         </div>
      </Layout>
   );
};

export default OrderPage;
