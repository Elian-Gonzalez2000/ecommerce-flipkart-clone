import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { genericPublicUrl } from "../../urlConfig";
import { randomUI } from "../../helpers/randomUI";
import { getOrders } from "../../actions";
import { Breed } from "../../components/MaterialUI";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import formatCurrency from "../../utilities/formatCurrency";
import { BiRupee } from "react-icons/bi";
import "./style.css";

const OrderPage = () => {
   const user = useSelector((state) => state.user);
   const auth = useSelector((state) => state.auth);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   useEffect(() => {
      if (!auth.authenticate) navigate("/");
   }, [auth.authenticate]);
   useEffect(() => {
      dispatch(getOrders());
   }, []);
   return (
      <Layout className={"order-page-container"}>
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
                  <Card key={randomUI()} classNames={"order-page-card"}>
                     <Link
                        to={`/order-details/${order._id}`}
                        className="order-item-container"
                     >
                        <picture>
                           <img
                              src={genericPublicUrl(
                                 item.productId.productPictures[0].img
                              )}
                              alt={item.productId.productPictures[0].img}
                           />
                        </picture>
                        <p>{item.productId.name}</p>
                        <p>
                           {<BiRupee />}
                           {formatCurrency({
                              value: item.payablePrice,
                              style: "decimal",
                           })}
                        </p>
                        <p style={{ fontWeight: "bolder" }}>
                           {order.paymentStatus === "pending" ? (
                              <span className="payment-status-icon-pending"></span>
                           ) : (
                              <span className="payment-status-icon-completed"></span>
                           )}
                           {order.paymentStatus}
                        </p>
                     </Link>
                  </Card>
               ));
            })}
      </Layout>
   );
};

export default OrderPage;
