import React from "react";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

function CartPage(props) {
   const cart = useSelector((state) => state.cart);
   const cartItems = cart.cartItems;

   return (
      <Layout>
         <div className="cart-container">
            <Card headerLeft={"My Cart"} headerRight={<div>Delivered to</div>}>
               {Object.keys(cartItems).map((item, index) => {
                  return <CartItem key={index} cartItem={cartItems[item]} />;
               })}
            </Card>
            <Card style={{ width: "500px" }}>price</Card>
         </div>
      </Layout>
   );
}

export default CartPage;
