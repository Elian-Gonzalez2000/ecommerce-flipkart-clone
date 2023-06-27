import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import { addToCart, getCartItems } from "../../actions";

function CartPage(props) {
   const cart = useSelector((state) => state.cart);
   const auth = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   //const cartItems = cart.cartItems;
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
      //console.log(id, qty);
      const { name, price, img } = cartItems[_id];
      dispatch(addToCart({ _id, name, price, img }, 1));
   };

   const onQuantityDecrement = (_id, qty) => {
      //console.log(id, qty);
      const { name, price, img } = cartItems[_id];
      dispatch(addToCart({ _id, name, price, img }, -1));
   };

   return (
      <Layout>
         <div className="cart-container">
            <Card headerLeft={"My Cart"} headerRight={<div>Delivered to</div>}>
               {Object.keys(cartItems).map((item, index) => {
                  return (
                     <CartItem
                        key={index}
                        cartItem={cartItems[item]}
                        onQuantityInc={onQuantityIncrement}
                        onQuantityDec={onQuantityDecrement}
                     />
                  );
               })}
            </Card>
            <Card style={{ width: "500px" }}>price</Card>
         </div>
      </Layout>
   );
}

export default CartPage;
