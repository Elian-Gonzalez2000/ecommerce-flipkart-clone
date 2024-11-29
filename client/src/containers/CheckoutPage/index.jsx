import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  addOrder,
  deleteAddress,
  getAddress,
  getCartItems,
} from "../../actions";
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
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { PUBLIC_KEY_STRIPE } from "../../urlConfig";
import axios from "../../helpers/axios";
const stripePromise = loadStripe(PUBLIC_KEY_STRIPE);

const CheckoutStep = (props) => {
  const stripe = useStripe();
  const [inputValue, setInputValue] = useState(null);
  return (
    <div className="checkout-step">
      <div
        onClick={props.onClick}
        className={`checkout-header ${props.active && "active"}`}
      >
        <div>
          <span className="step-number">{props.stepNumber}</span>
          <span className="step-title">{props.title}</span>
          {props.changeData && !props.active ? (
            <span className="step-change" onClick={props.changeData.onClick}>
              {props.changeData.text}
            </span>
          ) : null}
        </div>
      </div>
      {props.body && props.body}
      {props.stepNumber === "4" && props.active ? (
        <div className="step-completed">
          <div className="flexRow">
            <label className="address-radio">
              <input
                type="radio"
                name="paymentOption"
                value="stripe"
                onClick={(e) => setInputValue(e.target.value)}
              />
              <span className="checkMark"></span>
            </label>
            <p>Stripe</p>
          </div>
          <div className="flexRow">
            <label className="address-radio">
              <input
                type="radio"
                name="paymentOption"
                value="cod"
                onClick={(e) => setInputValue(e.target.value)}
              />
              <span className="checkMark"></span>
            </label>
            <p>Cash on delivery</p>
          </div>
          <MaterialButton
            title="CONFIRM ORDER"
            onClick={() => {
              return props.onConfirmOrder(inputValue, stripe);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

const Address = ({
  selectAddress,
  enableAddressEditForm,
  deleteAddressForm,
  confirmDeliveryAddress,
  onAddressSubmit,
  adr,
}) => {
  return (
    <div className="address-container">
      {!adr.edit ? (
        <div className="address-detail-container">
          <div className="address-detail-header">
            <label className="address-radio">
              <input
                name="address"
                type="radio"
                onClick={() => selectAddress(adr)}
              />
              <span className="checkMark"></span>
            </label>
            <div className="address-name">
              <h4>
                {adr.name}{" "}
                <span className="address-type">{adr.addressType}</span>
              </h4>
            </div>
            <div className="address-edit">
              {adr.selected && (
                <>
                  <Anchor
                    styles={{ marginRight: "1rem" }}
                    name="EDIT"
                    onClick={() => enableAddressEditForm(adr)}
                  />
                  <Anchor
                    name="DELETE"
                    onClick={() => deleteAddressForm(adr)}
                  />
                </>
              )}
            </div>
          </div>
          <div className="address-detail-info">
            <div className="address-mobile-number">
              <p>
                <h6>Mobile Number: </h6>
                {adr.mobileNumber}
              </p>
              <p>
                <h6>Alternative Phone: </h6>
                {adr.alternatePhone}
              </p>
            </div>

            <div className="full-address">
              <h5 style={{ marginBottom: ".4rem" }}>Address </h5>
              <span>
                <h6> Full address: </h6> {adr.address}
              </span>{" "}
              <br />
              <span>
                <h6>State: </h6> {` ${adr.state}`}
              </span>{" "}
              <br />
              <span>
                <h6>Pincode: </h6> {` ${adr.pinCode}`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Edit Address</h4>
            <Anchor
              name="CANCEL EDIT"
              onClick={() => enableAddressEditForm(adr, 1)}
            />
          </div>
          <AddressForm
            withoutLayout={true}
            onSubmitForm={onAddressSubmit}
            initialData={adr}
            onCancel={() => props.onCancel()}
          />
        </>
      )}
      {adr.selected && !adr.edit && (
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

  const enableAddressEditForm = (addr, cancel = false) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id && cancel === false
        ? { ...adr, edit: true }
        : { ...adr, edit: false }
    );
    setAddress(updatedAddress);
  };

  const deleteAddressForm = (addrToDelete) => {
    dispatch(deleteAddress(addrToDelete));
    console.log("adr deleted", addrToDelete);
  };

  const userOrderConfirmation = () => {
    setOrderConfirmation(true);
    setOrderSummary(false);
    setPaymentOption(true);
  };

  const onConfirmOrder = async (selectedMethod, stripePayload) => {
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
    const payload = {
      addressId: selectedAddress._id,
      totalAmount,
      items,
      paymentStatus: "pending",
      paymentType: selectedMethod,
    };
    console.log(payload);
    if (payload.paymentType === "cod") {
      dispatch(addOrder(payload));
    }
    try {
      const BASEURLSTRIPE = false
        ? "http://localhost:3002/api"
        : "https://flipkart-rest-server-jvxd.onrender.com/api";
      if (payload.paymentType === "stripe") {
        // Realiza una petición al backend para generar la sesión de Stripe
        const response = await axios.post(
          `${BASEURLSTRIPE}/stripe/create-checkout-session-stripe`,
          payload
        );

        // Redirigir al checkout de Stripe
        if (response.status === 200) {
          const { error } = await stripePayload.redirectToCheckout({
            sessionId: response.data.id,
          });
          if (error) {
            console.error("Error al redirigir al checkout de Stripe:", error);
          }
        }
      }
    } catch (error) {
      if (error) {
        console.error("Error al redirigir al checkout de Stripe:", error);
      }
    }
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
    <Elements stripe={stripePromise}>
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
                    <div className="logged-in-id step-completed">
                      <span className="logged-fullname d-inline-block me-3">
                        {auth.user.fullName}
                      </span>
                      <span className="logged-email">{auth.user.email}</span>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <MaterialInput label="Email" />
                    </div>
                  )
                }
              />

              {confirmAddress ? null : newAddress ? (
                <AddressForm
                  onSubmitForm={onAddressSubmit}
                  onCancel={() => setNewAddress(false)}
                  active={true}
                />
              ) : auth.authenticate ? (
                <CheckoutStep
                  stepNumber={"+"}
                  title={"ADD NEW ADDRESS"}
                  active={newAddress}
                  onClick={() => setNewAddress(true)}
                />
              ) : null}

              <CheckoutStep
                stepNumber={"2"}
                title={"DELIVERY ADDRESS"}
                active={!confirmAddress && auth.authenticate}
                changeData={
                  confirmAddress &&
                  orderSummary && {
                    onClick: () => {
                      setOrderSummary(
                        orderConfirmation && setOrderSummary(false)
                      );
                      setConfirmAddress(false);
                      setPaymentOption(false);
                    },
                    text: "Change Address",
                  }
                }
                body={
                  <>
                    {confirmAddress ? (
                      <div className="step-completed">{`${selectedAddress.address} - ${selectedAddress.pinCode}`}</div>
                    ) : (
                      address.map((adr) => (
                        <Address
                          key={`${adr._id}`}
                          selectAddress={selectAddress}
                          enableAddressEditForm={enableAddressEditForm}
                          deleteAddressForm={deleteAddressForm}
                          confirmDeliveryAddress={confirmDeliveryAddress}
                          onAddressSubmit={onAddressSubmit}
                          adr={adr}
                        />
                      ))
                    )}
                  </>
                }
              />

              {/* Address Form */}

              <CheckoutStep
                stepNumber={"3"}
                title={"ORDER SUMMARY"}
                active={orderSummary}
                changeData={
                  orderConfirmation && {
                    onClick: () => {
                      setOrderSummary(true);
                      setOrderConfirmation(false);
                      setPaymentOption(false);
                      setNewAddress(false);
                      setConfirmAddress(true);
                    },
                    text: "Change summary",
                  }
                }
                body={
                  orderSummary ? (
                    <CartPage onlyCartItems={true} />
                  ) : orderConfirmation ? (
                    <div className="step-completed">{"Ready to checkout"}</div>
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
                      Order confirmation email will be sent to {auth.user.email}
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
                onConfirmOrder={onConfirmOrder}
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
    </Elements>
  );
};

export default CheckoutPage;
