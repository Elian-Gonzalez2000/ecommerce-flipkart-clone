import React, { useState } from "react";
import "./styles.css";
import { genericPublicUrl } from "../../../urlConfig";
import { BiRupee } from "react-icons/bi";

function CartItem(props) {
  const [qty, setQty] = useState(props.cartItem.quantity);
  const { _id, name, price, quantity, cartItemImg } = props.cartItem;

  const onQuantityIncrement = () => {
    setQty(quantity + 1);
    props.onQuantityInc(_id, qty);
  };

  const onQuantityDecrement = () => {
    if (qty <= 1) return;
    setQty(quantity - 1);
    props.onQuantityDec(_id, qty);
  };
  return (
    <article className="cart-item-container">
      <div className="cart-item-data-container">
        <picture className="cart-pro-img-container">
          <img src={genericPublicUrl(cartItemImg.img)} alt="" />
        </picture>
        <div className="cart-item-details">
          <div>
            <p>{name}</p>
            <p className="item-price">
              {formatCurrency(
                { currency: "INR", value: props.value },
                { trailingZeroDisplay: "stripIfInteger" }
              )}
            </p>
          </div>
          <div className="delivered-in">
            <span>Delivered in ...</span>
          </div>
        </div>
      </div>
      <div className="cart-quantity-container">
        <div className="quantity-control">
          <button onClick={onQuantityDecrement}>-</button>
          <input value={qty} readOnly />
          <button onClick={onQuantityIncrement}>+</button>
        </div>
        <button className="cart-action-btn">Save for later</button>
        <button
          className="cart-action-btn"
          style={{ color: "var(--first-color)" }}
          onClick={() => props.onRemoveCartItem(_id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default CartItem;
