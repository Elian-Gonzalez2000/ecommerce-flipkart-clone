import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { addOrder, getAddress, getCartItems } from "../../actions";
import {
   Anchor,
   MaterialButton,
   MaterialInput,
} from "../../components/MaterialUI";
import AddressForm from "./AddressForm";
import Card from "../../components/UI/Card";
import "./style.css";
import PriceDetails from "../../components/PriceDetails";
import CartPage from "../CartPage";
import Loader from "../../components/UI/Loader";

const CheckoutStep = (props) => {
   return (
      <div className="checkout-step">
         <div
            onClick={props.onClick}
            className={`checkout-header ${props.active && "active"}`}
         >
            <div>
               <span className="step-number">{props.stepNumber}</span>
               <span className="step-title">{props.title}</span>
            </div>
         </div>
         {props.body && props.body}
      </div>
   );
};

const Address = ({
   selectAddress,
   enableAddressEditForm,
   confirmDeliveryAddress,
   onAddressSubmit,
   adr,
}) => {
   return (
      <div className="flexRow address-container">
         <div>
            <input
               name="address"
               type="radio"
               onClick={() => selectAddress(adr)}
            />
         </div>
         <div className="flexRow sb address-info">
            {!adr.edit ? (
               <div className="address-detail">
                  <div>
                     <div
                        style={{
                           marginBottom: "1rem",
                        }}
                     >
                        <span className="address-name">{adr.name}</span>
                        <span className="address-type">{adr.addressType}</span>
                        <span className="address-mobile-number">
                           {adr.mobileNumber}
                        </span>
                     </div>

                     <div className="full-address">
                        {adr.address} <br />
                        {`${adr.state} - ${adr.pinCode}`}
                     </div>
                     {adr.selected && (
                        <MaterialButton
                           title="DELIVERY HERE"
                           onClick={() => confirmDeliveryAddress(adr)}
                           style={{
                              width: "250px",
                              margin: "10px 0",
                           }}
                        />
                     )}
                  </div>
                  {adr.selected && (
                     <Anchor
                        name="EDIT"
                        onClick={() => enableAddressEditForm(adr)}
                        style={{
                           fontWeight: "500",
                           color: "#2874f0",
                        }}
                     />
                  )}
               </div>
            ) : (
               <AddressForm
                  withoutLayout={true}
                  onSubmitForm={onAddressSubmit}
                  initialData={adr}
                  onCancel={() => {}}
               />
            )}
         </div>
      </div>
   );
};

const CheckoutPage = () => {
   const user = useSelector((state) => state.user);
   const auth = useSelector((state) => state.auth);
   const cart = useSelector((state) => state.cart);
   const navigate = useNavigate();
   const [address, setAddress] = useState([]);
   const [newAddress, setNewAddress] = useState(false);
   const [confirmAddress, setConfirmAddress] = useState(false);
   const [orderSummary, setOrderSummary] = useState(false);
   const [orderConfirmation, setOrderConfirmation] = useState(false);
   const [paymentOption, setPaymentOption] = useState(false);
   const [confirmOrder, setConfirmOrder] = useState(false);
   const [selectedAddress, setSelectedAddress] = useState(null);

   const dispatch = useDispatch();
   const onAddressSubmit = (addr) => {
      setSelectedAddress(addr);
      setConfirmAddress(true);
      setOrderSummary(true);
   };

   const confirmDeliveryAddress = (addr) => {
      setSelectedAddress(addr);
      setConfirmAddress(true);
      setOrderSummary(true);
   };

   const selectAddress = (addr) => {
      console.log("addr", addr);

      const updatedAddress = address.map((adr) =>
         adr._id === addr._id
            ? { ...adr, selected: true }
            : { ...adr, selected: false }
      );
      setAddress(updatedAddress);
      console.log("adr", address);
   };

   const enableAddressEditForm = (addr) => {
      const updatedAddress = address.map((adr) =>
         adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
      );
      setAddress(updatedAddress);
   };

   const userOrderConfirmation = () => {
      setOrderConfirmation(true);
      setOrderSummary(false);
      setPaymentOption(true);
   };

   const onConfirmOrder = () => {
      const totalAmount = Object.keys(cart.cartItems).reduce(
         (totalPrice, key) => {
            const { price, quantity } = cart.cartItems[key];
            return totalPrice + price * quantity;
         },
         0
      );
      const items = Object.keys(cart.cartItems).map((key) => ({
         productId: key,
         payablePrice: cart.cartItems[key].price,
         purchasedQty: cart.cartItems[key].quantity,
      }));
      console.log(items);
      const payload = {
         addressId: selectedAddress._id,
         totalAmount,
         items,
         paymentStatus: "pending",
         paymentType: "cod",
      };
      console.log(payload);
      dispatch(addOrder(payload));
      setConfirmOrder(true);
   };

   useEffect(() => {
      auth.authenticate && dispatch(getAddress());
      auth.authenticate && dispatch(getCartItems());
      if (!auth.authenticate) navigate("/");
   }, [auth.authenticate]);

   useEffect(() => {
      const address = user.address.map((adr) => ({
         ...adr,
         selected: false,
         edit: false,
      }));
      setAddress(address);
      //user.address.length === 0 && setNewAddress(true);
   }, [user.address]);

   return (
      <Layout>
         {user.loading && <Loader />}
         {
            <div
               className="cart-container"
               style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  marginTop: "1rem",
               }}
            >
               <div className="checkout-container">
                  <CheckoutStep
                     stepNumber={"1"}
                     title={"LOGIN"}
                     active={!auth.authenticate}
                     body={
                        auth.authenticate ? (
                           <div className="logged-in-id">
                              <span style={{ fontWeight: "500" }}>
                                 {auth.user.fullName}
                              </span>
                              <span style={{ margin: "0 5px" }}>
                                 {auth.user.email}
                              </span>
                           </div>
                        ) : (
                           <div>
                              {" "}
                              <MaterialInput label="Email" />
                           </div>
                        )
                     }
                  />

                  <CheckoutStep
                     stepNumber={"2"}
                     title={"DELIVERY ADDRESS"}
                     active={!confirmAddress && auth.authenticate}
                     body={
                        <>
                           {confirmAddress ? (
                              <div className="step-completed">{`${selectedAddress.address} - ${selectedAddress.pinCode}`}</div>
                           ) : (
                              address.map((adr) => (
                                 <Address
                                    key={`${adr._id}`}
                                    selectAddress={selectAddress}
                                    enableAddressEditForm={
                                       enableAddressEditForm
                                    }
                                    confirmDeliveryAddress={
                                       confirmDeliveryAddress
                                    }
                                    onAddressSubmit={onAddressSubmit}
                                    adr={adr}
                                 />
                              ))
                           )}
                        </>
                     }
                  />

                  {/* Address Form */}

                  {confirmAddress ? null : newAddress ? (
                     <AddressForm
                        onSubmitForm={onAddressSubmit}
                        onCancel={() => {}}
                     />
                  ) : auth.authenticate ? (
                     <CheckoutStep
                        stepNumber={"+"}
                        title={"ADD NEW ADDRESS"}
                        active={false}
                        onClick={() => setNewAddress(true)}
                     />
                  ) : null}

                  <CheckoutStep
                     stepNumber={"3"}
                     title={"ORDER SUMMARY"}
                     active={orderSummary}
                     body={
                        orderSummary ? (
                           <CartPage onlyCartItems={true} />
                        ) : orderConfirmation ? (
                           <div className="step-completed">Items</div>
                        ) : null
                     }
                  />
                  {orderSummary && (
                     <Card style={{ margin: "10px 0" }}>
                        <div
                           className="flexRow sb"
                           style={{
                              padding: "1rem 30px",
                              alignItems: "center",
                           }}
                        >
                           <p style={{ margin: "10px 0" }}>
                              Order confirmation email will be sent to{" "}
                              {auth.user.email}
                           </p>
                           <MaterialButton
                              title={"CONTINUE"}
                              onClick={userOrderConfirmation}
                              style={{ width: "200px" }}
                           />
                        </div>
                     </Card>
                  )}

                  <CheckoutStep
                     stepNumber={"4"}
                     title={"PAYMENT OPTIONS"}
                     active={paymentOption}
                     body={
                        paymentOption && (
                           <div className="step-completed">
                              <div className="flexRow">
                                 <input
                                    type="radio"
                                    name="paymentOption"
                                    value="cod"
                                 />
                                 <p>Cash on delivery</p>
                              </div>
                              <MaterialButton
                                 title="CONFIRM ORDER"
                                 onClick={onConfirmOrder}
                              />
                           </div>
                        )
                     }
                  />
               </div>

               {/* Price Component */}
               {
                  <PriceDetails
                     totalItem={Object.keys(cart.cartItems).reduce(function (
                        qty,
                        key
                     ) {
                        return qty + cart.cartItems[key].quantity;
                     },
                     0)}
                     totalPrice={Object.keys(cart.cartItems).reduce(
                        (totalPrice, key) => {
                           const { price, quantity } = cart.cartItems[key];
                           return totalPrice + price * quantity;
                        },
                        0
                     )}
                  />
               }
            </div>
         }
      </Layout>
   );
};

export default CheckoutPage;
