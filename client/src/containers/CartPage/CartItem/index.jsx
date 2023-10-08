import React, { useState } from "react";
import "./styles.css";
import { genericPublicUrl } from "../../../urlConfig";

function CartItem(props) {
   const [qty, setQty] = useState(props.cartItem.quantity);
   const { _id, name, price, quantity, img } = props.cartItem;

   const onQuantityIncrement = () => {
      setQty(quantity + 1);
      props.onQuantityInc(_id, qty + 1);
   };

   const onQuantityDecrement = () => {
      if (qty <= 1) return;
      setQty(quantity - 1);
      props.onQuantityDec(_id, qty - 1);
   };
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
               <button onClick={onQuantityDecrement}>-</button>
               <input value={quantity} readOnly />
               <button onClick={onQuantityIncrement}>+</button>
            </div>
            <button className="cart-action-btn">Save for later</button>
            <button
               className="cartActionBtn"
               onClick={() => props.onRemoveCartItem(_id)}
            >
               Remove
            </button>
         </div>
      </div>
   );
}

export default CartItem;
