import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import { addToCart, getCartItems, removeCartItem } from "../../actions";
import { MaterialButton } from "../../components/MaterialUI";
import { useNavigate } from "react-router-dom";
import PriceDetails from "../../components/PriceDetails";
import "./styles.css";
import Loader from "../../components/UI/Loader";
import { Helmet } from "react-helmet";

function CartPage(props) {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(cart.cartItems);

  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getCartItems());
    }
  }, [auth.authenticate]);

  const onQuantityIncrement = (_id, qty) => {
    const { name, price, cartItemImg } = cartItems[_id];
    dispatch(addToCart({ _id, name, price, cartItemImg }, 1));
  };

  const onQuantityDecrement = (_id, qty) => {
    const { name, price, cartItemImg } = cartItems[_id];
    dispatch(addToCart({ _id, name, price, cartItemImg }, -1));
  };

  const onRemoveCartItem = (_id) => {
    console.log(_id);
    dispatch(removeCartItem({ productId: _id }));
    if (!auth.authenticate) setCartItems(cart.cartItems);
  };

  if (props.onlyCartItems) {
    return (
      <>
        {cartItems &&
          Object.keys(cartItems).map((item, index) => {
            return (
              <CartItem
                key={index}
                cartItem={cartItems[item]}
                onQuantityInc={onQuantityIncrement}
                onQuantityDec={onQuantityDecrement}
              />
            );
          })}
      </>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{"Shopping Cart | Flipkart.com Clone"}</title>
        <meta
          property="og:title"
          content="Shopping Cart | Flipkart.com Clone"
        />
        <meta
          property="og:url"
          content="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/cart"
        />

        <meta
          property="og:description"
          content="Online Shopping India Mobile, Cameras, Lifestyle &amp; more Online @ Flipkart.com"
        />

        <meta
          name="twitter:url"
          content="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/cart"
        />
        <meta
          name="twitter:title"
          content="Shopping Cart | Flipkart.com Clone"
        />
      </Helmet>
      <div className="cart-container">
        {cart.updatingCart && <Loader />}
        <Card
          headerLeft={`My Cart  (${
            cartItems ? Object.keys(cartItems).length : "No items"
          })`}
          headerRight={<div>Delivered to</div>}
          style={{ width: "calc(100% - 400px)", overflow: "hidden" }}
        >
          <div style={{ minHeight: "200px" }}>
            {cartItems &&
              Object.keys(cartItems).map((item, index) => {
                return (
                  <CartItem
                    key={index}
                    cartItem={cartItems[item]}
                    onQuantityInc={onQuantityIncrement}
                    onQuantityDec={onQuantityDecrement}
                    onRemoveCartItem={onRemoveCartItem}
                  />
                );
              })}
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              background: "#ffffff",
              justifyContent: "flex-end",
              boxShadow: "0 0 10px 10px #eee",
              padding: "10px 0",
            }}
          >
            <div style={{ width: "250px", marginRight: "1rem" }}>
              <MaterialButton
                title="PLACE ORDER"
                onClick={() => navigate("/checkout")}
              />
            </div>
          </div>
        </Card>
        <PriceDetails
          totalItem={
            cart.cartItems &&
            Object.keys(cart.cartItems).reduce(function (qty, key) {
              return qty + cart.cartItems[key].quantity;
            }, 0)
          }
          totalPrice={
            cart.cartItems &&
            Object.keys(cart.cartItems).reduce((totalPrice, key) => {
              const { price, quantity } = cart.cartItems[key];
              return totalPrice + price * quantity;
            }, 0)
          }
        />
      </div>
    </Layout>
  );
}

export default CartPage;
