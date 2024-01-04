import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getOrder } from "../../actions";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import "./style.css";
import { genericPublicUrl } from "../../urlConfig";
import { randomUI } from "../../helpers/randomUI";
import { MaterialButton } from "../../components/MaterialUI";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

/**
 * @author
 * @function OrderDetails
 **/

const OrderDetailsPage = (props) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const params = useParams();
   const orderDetails = useSelector((state) => state.user.orderDetails);

   useEffect(() => {
      console.log({ props });
      const payload = {
         orderId: params.orderId,
      };
      dispatch(getOrder(payload));
   }, []);

   const formatDate = (date) => {
      if (date) {
         const d = new Date(date);
         return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      }
      return "";
   };

   const formatDate2 = (date) => {
      const month = [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "June",
         "July",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ];
      if (date) {
         const d = new Date(date);
         return `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }
   };

   if (!(orderDetails && orderDetails.address)) {
      return null;
   }

   return (
      <Layout className={"order-details-container"}>
         <Card classNames={"user-details-container"}>
            <div className="delAdrContainer">
               <div className="delAdrDetails">
                  <h4 className="delTitle">Delivery Address</h4>
                  <span className="delName">{orderDetails.address.name}</span>
                  <span className="delAddress">
                     {orderDetails.address.address}
                  </span>
                  <span className="delPhoneNumber">
                     <strong>Phone number: </strong>{" "}
                     {orderDetails.address.mobileNumber}
                  </span>
               </div>
               <div className="delMoreActionContainer">
                  <h4 className="delTitle">More Actions</h4>
                  <span className="delName">Download Invoice</span>
               </div>
            </div>
         </Card>

         {orderDetails.items.map((item, index) => (
            <Card key={randomUI()} classNames={"send-order-timeline"}>
               <div style={{ padding: "25px 50px" }}>
                  <div className="orderTrack">
                     {orderDetails.orderStatus.map((status) => (
                        <div
                           key={randomUI()}
                           className={`orderStatus ${
                              status.isCompleted ? "active" : ""
                           }`}
                        >
                           <div
                              className={`point ${
                                 status.isCompleted ? "active" : ""
                              }`}
                           ></div>
                           <div className="orderInfo">
                              <div className="status">{status.type}</div>
                              <div className="date">
                                 {formatDate(status.date)}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <p className="finish-order-date">
                  {orderDetails.orderStatus[3].isCompleted &&
                     `Delivered on ${formatDate2(
                        orderDetails.orderStatus[3].date
                     )}`}
               </p>
            </Card>
         ))}
         <MaterialButton
            title={` Back`}
            icon={<BiArrowBack />}
            bgColor={"var(--first-color)"}
            width={"175px"}
            onClick={() => navigate("/account/orders")}
         />
      </Layout>
   );
};

export default OrderDetailsPage;
