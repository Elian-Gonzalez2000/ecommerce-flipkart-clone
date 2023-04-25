import React, { useState } from "react";
import "./styles.css";
import { genericPublicUrl } from "../../../urlConfig";

function CartItem({ _id, name, price, quantity, img }) {
   return (
      <div className="cart-item-container">
         <div className="flexRow">
            <div className="cart-pro-img-container">
               <img src={genericPublicUrl(img)} alt="" />
            </div>
            <div className="cart-item-details">
               <div>
                  <p>{name}</p>
                  <p>Rs. {price}</p>
               </div>
               <div>Delivered in ...</div>
            </div>
         </div>
         <div
            style={{
               display: "flex",
               margin: "5px 0",
            }}
         >
            <div className="quantity-control">
               <button>-</button>
               <input value={quantity} readOnly />
               <button>+</button>
            </div>
            <button className="cart-action-btn">Save for later</button>
            <button className="cart-action-btn">Remove</button>
         </div>
      </div>
   );
}

export default CartItem;
