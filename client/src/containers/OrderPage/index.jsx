import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../actions";
import { genericPublicUrl } from "../../urlConfig";
import "./style.css";

const OrderPage = (props) => {
   const user = useSelector((state) => state.user);
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getOrders());
   }, []);
   return (
      <Layout>
         {console.log(user.orders)}
         {user.orders.length > 0 &&
            user.orders.map((order) => {
               return order.items.map((item) => (
                  <div className="order-item-container">
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
                              style={{ maxWidth: "80px", maxHeight: "80px" }}
                              src={genericPublicUrl(
                                 item.productId.productPictures[0].img
                              )}
                           />
                        </picture>
                        <p style={{ width: "300px" }}>{item.productId.name}</p>
                        <p>{item.payablePrice}</p>
                        <p>{order.paymentStatus}</p>
                     </div>
                  </div>
               ));
            })}
      </Layout>
   );
};

export default OrderPage;
