import React from "react";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import { useSelector } from "react-redux";

function CartPage(props) {
   const cart = useSelector((state) => state.cart);
   const cartItems = cart.cartItems;

   return (
      <Layout>
         <div className="cart-container">
            <Card headerLeft={"My Cart"} headerRight={<div>Delivered to</div>}>
               {Object.keys(cartItems).map((item, index) => {
                  return (
                     <div key={index} className="flexRow">
                        <div className="cart-product-container">
                           {/*  <img src="" /> */}
                        </div>
                        <div className="cart-item-details">
                           <div>
                              {cartItems[item].name} - quantity -{" "}
                              {cartItems[item].quantity}
                           </div>
                           <div>Delivery in ...</div>
                        </div>
                     </div>
                  );
               })}
            </Card>
            <Card style={{ width: "500px" }}>price</Card>
         </div>
      </Layout>
   );
}

export default CartPage;
