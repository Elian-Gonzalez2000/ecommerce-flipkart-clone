import React, { useEffect, useState } from "react";
import "./style.css";
import flipkartLogo from "../../images/logo/flipkart.png";
import goldenStar from "../../images/logo/golden-star.png";
import { IoIosArrowDown, IoIosCart, IoIosSearch } from "react-icons/io";
import {
   Modal,
   MaterialInput,
   MaterialButton,
   DropdownMenu,
} from "../MaterialUI";
import { useDispatch, useSelector } from "react-redux";
import { login, signout, signup as _signup } from "../../actions";
import Cart from "../UI/Cart";
import { Link } from "react-router-dom";

/**
 * @author
 * @function Header
 **/

const Header = (props) => {
   const [loginModal, setLoginModal] = useState(false);
   const [signup, setSignup] = useState(false);
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const auth = useSelector((state) => state.auth);
   const cart = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   const userSignup = () => {
      const user = { firstName, lastName, email, password };
      if (
         firstName === "" ||
         lastName === "" ||
         email === "" ||
         password === ""
      ) {
         return;
      }

      dispatch(_signup(user));
   };

   const userLogin = () => {
      if (signup) {
         userSignup();
      } else {
         dispatch(login({ email, password }));
      }
   };

   const logout = () => {
      dispatch(signout());
   };

   useEffect(() => {
      if (auth.authenticate) {
         setLoginModal(false);
      }
   }, [auth.authenticate]);

   const renderLoggingInMenu = () => {
      return (
         <DropdownMenu
            menu={<Link className="fullName">{auth.user.fullName}</Link>}
            menus={[
               { label: "My Profile", href: "", icon: null },
               { label: "SuperCoins Zone", href: "", icon: null },
               { label: "Flipkart Plus Zone", href: "", icon: null },
               { label: "Orders", href: `/account/orders`, icon: null },
               { label: "Wishlist", href: "", icon: null },
               { label: "My Chats", href: "", icon: null },
               { label: "Coupons", href: "", icon: null },
               { label: "Rewards", href: "", icon: null },
               { label: "Notifications", href: "", icon: null },
               { label: "Gift Cards", href: "", icon: null },
               { label: "Logout", href: "", icon: null, onClick: logout },
            ]}
         />
      );
   };

   const renderNotLoggedInMenu = () => {
      return (
         <DropdownMenu
            menu={
               <Link
                  className="loginButton"
                  onClick={() => {
                     setSignup(false);
                     setLoginModal(true);
                  }}
               >
                  Login
               </Link>
            }
            menus={[
               { label: "My Profile", href: "", icon: null },
               { label: "Flipkart Plus Zone", href: "", icon: null },
               {
                  label: "Orders",
                  href: "/account/orders",
                  icon: null,
                  onClick: () => {
                     !auth.authenticate && setLoginModal(true);
                  },
               },
               { label: "Wishlist", href: "", icon: null },
               { label: "Rewards", href: "", icon: null },
               { label: "Gift Cards", href: "", icon: null },
            ]}
            firstMenu={
               <div className="firstmenu">
                  <span>New Customer?</span>
                  <Link
                     onClick={() => {
                        setLoginModal(true);
                        setSignup(true);
                     }}
                     style={{ color: "#2874f0" }}
                  >
                     Sign Up
                  </Link>
               </div>
            }
         />
      );
   };

   return (
      <div className="header">
         <Modal visible={loginModal} onClose={() => setLoginModal(false)}>
            <div className="authContainer">
               <div className="row">
                  <div className="leftspace">
                     <h2>Login</h2>
                     <p>
                        Get access to your Orders, Wishlist and Recommendations
                     </p>
                  </div>
                  <div className="rightspace">
                     <div className="login-input-container">
                        {auth.error && (
                           <div style={{ color: "red", fontSize: 12 }}>
                              {auth.error}
                           </div>
                        )}
                        {signup && (
                           <MaterialInput
                              type="text"
                              label="First Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                           />
                        )}
                        {signup && (
                           <MaterialInput
                              type="text"
                              label="Last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                           />
                        )}

                        <MaterialInput
                           type="text"
                           label="Enter Email/Enter Mobile Number"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />

                        <MaterialInput
                           type="password"
                           label="Enter Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           // rightElement={<a href="#">Forgot?</a>}
                        />
                        <br />
                        <br />
                        <MaterialButton
                           title={signup ? "Register" : "Login"}
                           bgColor="#fb641b"
                           textColor="#ffffff"
                           style={{
                              margin: "40px 0 20px 0",
                           }}
                           onClick={userLogin}
                        />
                        <br />
                        <p style={{ textAlign: "center" }}>OR</p>
                        <MaterialButton
                           title="Request OTP"
                           bgColor="#ffffff"
                           textColor="#2874f0"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </Modal>
         <div className="subHeader">
            <div className="logo">
               <Link to="/">
                  <img src={flipkartLogo} className="logoimage" alt="" />
               </Link>
               <Link style={{ marginTop: "-10px" }}>
                  <span className="exploreText">Explore</span>
                  <span className="plusText">Plus</span>
                  <img src={goldenStar} className="goldenStar" alt="" />
               </Link>
            </div>
            {/* End logo Component */}

            {/* Search Component */}
            <div
               style={{
                  padding: "0 10px",
               }}
            >
               <div className="searchInputContainer">
                  <input
                     className="searchInput"
                     placeholder={"search for products, brands and more"}
                  />
                  <div className="searchIconContainer">
                     <IoIosSearch
                        style={{
                           color: "#2874f0",
                        }}
                     />
                  </div>
               </div>
            </div>
            {/* End search Component */}

            {/* Right side menu */}
            <div className="rightMenu" style={{ zIndex: "999" }}>
               {auth.authenticate
                  ? renderLoggingInMenu()
                  : renderNotLoggedInMenu()}
               <DropdownMenu
                  style={{}}
                  menu={
                     <Link className="more">
                        <span>More</span>
                        <IoIosArrowDown />
                     </Link>
                  }
                  menus={[
                     { label: "Notification Preference", href: "", icon: null },
                     { label: "Sell on flipkart", href: "", icon: null },
                     { label: "24x7 Customer Care", href: "", icon: null },
                     { label: "Advertise", href: "", icon: null },
                     { label: "Download App", href: "", icon: null },
                  ]}
               />
               <div>
                  <Link className="cart" to="/cart">
                     <Cart
                        count={
                           cart.cartItems && Object.keys(cart.cartItems).length
                        }
                     />
                     <span style={{ margin: "0 10px" }}>Cart</span>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Header;
