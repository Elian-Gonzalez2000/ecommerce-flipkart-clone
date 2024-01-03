import React from "react";
import Card from "../../components/UI/Card";
import "./style.css";
import formatCurrency from "../../utilities/formatCurrency";
import { BiRupee } from "react-icons/bi";

/**
 * @author
 * @function PriceDetails
 **/

const PriceDetails = (props) => {
   return (
      <Card headerLeft={"Price Details"} classNames={"price-details-card"}>
         <div className="price-details-container">
            <div className="flex-row sb">
               <span>Price ({props.totalItem} items)</span>
               <span className="flex-row ac">
                  <BiRupee />
                  {formatCurrency({
                     currency: "",
                     value: props.totalPrice,
                     style: "decimal",
                  })}
               </span>
            </div>
            <div className="flex-row sb">
               <span>Delivery Charges</span>
               <span>FREE</span>
            </div>
            <div className="flex-row sb total-amount">
               <span>Total Amount</span>
               <span className="flex-row ac">
                  <BiRupee />
                  {formatCurrency({
                     currency: "",
                     value: props.totalPrice,
                     style: "decimal",
                  })}
               </span>
            </div>
         </div>
      </Card>
   );
};

export default PriceDetails;
