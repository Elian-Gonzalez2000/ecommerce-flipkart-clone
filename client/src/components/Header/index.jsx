import React, { useEffect, useState } from "react";
import "./style.css";
import flipkartLogo from "../../images/logo/flipkart.png";
// import goldenStar from "../../images/logo/golden-star.png";
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
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

/**
 * @author
 * @function Header
 **/

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8).required("Required"),
});

const signupSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8).required("Required"),
});

const Header = (props) => {
  const [loginModal, setLoginModal] = useState(false);
  const [signup, setSignup] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("");
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = (data) => {
    if (signup) {
      const { firstName, lastName, email, password } = data;
      dispatch(_signup({ firstName, lastName, email, password }));
    } else {
      const { email, password } = data;
      dispatch(login({ email, password }));
      console.log(redirectAfterLogin);

      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
      }
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
          { label: "My Profile", href: "/", icon: null },
          { label: "SuperCoins Zone", href: "/", icon: null },
          { label: "Flipkart Plus Zone", href: "/", icon: null },
          { label: "Orders", href: `/account/orders`, icon: null },
          { label: "Wishlist", href: "/", icon: null },
          { label: "My Chats", href: "/", icon: null },
          { label: "Coupons", href: "/", icon: null },
          { label: "Rewards", href: "/", icon: null },
          { label: "Notifications", href: "/", icon: null },
          { label: "Gift Cards", href: "/", icon: null },
          { label: "Logout", href: "/", icon: null, onClick: logout },
        ]}
      />
    );
  };

  const renderNotLoggedInMenu = () => {
    return (
      <DropdownMenu
        menu={
          <button
            className="loginButton"
            onClick={() => {
              setSignup(false);
              setLoginModal(true);
            }}
          >
            Login
          </button>
        }
        menus={[
          { label: "My Profile", href: "/", icon: null },
          { label: "Flipkart Plus Zone", href: "/", icon: null },
          {
            label: "Orders",
            href: "/account/orders",
            icon: null,
            onClick: () => {
              // We need to check if the user is authenticated and set the redirectAfterLogin to the correct path to redirect the user to the correct page
              !auth.authenticate && setLoginModal(true);
              setRedirectAfterLogin("/account/orders");
            },
          },
          { label: "Wishlist", href: "/", icon: null },
          { label: "Rewards", href: "/", icon: null },
          { label: "Gift Cards", href: "/", icon: null },
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
        <div className="auth-container">
          <div className="row">
            <div className="leftspace">
              <h2>Login</h2>
              <p>Get access to your Orders, Wishlist and Recommendations</p>
            </div>
            <div className="rightspace">
              {signup ? (
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                  }}
                  validationSchema={signupSchema}
                  onSubmit={(values) => {
                    // same shape as initial values
                    userLogin(values);
                  }}
                >
                  {({ errors, touched, values }) => (
                    <Form className="login-input-container">
                      <MaterialInput
                        label="Enter firstName"
                        className="materialInput"
                        name="firstName"
                        type="firstName"
                        touched={touched.firstName && touched.firstName}
                        values={values.firstName && values.firstName}
                      >
                        <Field name="firstName" />
                        {errors.firstName && touched.firstName ? (
                          <div className="input-error">{errors.firstName}</div>
                        ) : null}
                      </MaterialInput>
                      <MaterialInput
                        label="Enter lastName"
                        className="materialInput"
                        name="lastName"
                        type="lastName"
                        touched={touched.lastName && touched.lastName}
                        values={values.lastName && values.lastName}
                      >
                        <Field name="lastName" />
                        {errors.lastName && touched.lastName ? (
                          <div className="input-error">{errors.lastName}</div>
                        ) : null}
                      </MaterialInput>
                      <MaterialInput
                        label="Enter email"
                        className="materialInput"
                        name="email"
                        type="email"
                        touched={touched.email && touched.email}
                        values={values.email && values.email}
                      >
                        <Field type="email" name="email" />
                        {errors.email && touched.email ? (
                          <div className="input-error">{errors.email}</div>
                        ) : null}
                      </MaterialInput>

                      <MaterialInput
                        label="Enter Password"
                        className="materialInput"
                        name="password"
                        type="password"
                        touched={touched.password && touched.password}
                        values={values.password && values.password}
                      >
                        <Field type="password" name="password" />
                        {errors.password && touched.password ? (
                          <div className="input-error">{errors.password}</div>
                        ) : null}
                      </MaterialInput>

                      <br />
                      <br />
                      <MaterialButton
                        title={"Register"}
                        bgColor="#fb641b"
                        textColor="#ffffff"
                        style={{
                          margin: "40px 0 20px 0",
                        }}
                        type="submit"
                      />
                      <br />
                      <p style={{ textAlign: "center" }}>OR</p>
                      <MaterialButton
                        title="Request OTP"
                        bgColor="#ffffff"
                        textColor="#2874f0"
                      />
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                  }}
                  validationSchema={loginSchema}
                  onSubmit={(values) => {
                    // same shape as initial values
                    userLogin(values);
                  }}
                >
                  {({ errors, touched, values }) => (
                    <Form className="login-input-container">
                      <MaterialInput
                        label="Enter email"
                        className="materialInput"
                        name="email"
                        type="email"
                        touched={touched.email && touched.email}
                        values={values.email && values.email}
                      >
                        <Field type="email" name="email" />
                        {errors.email && touched.email ? (
                          <div className="input-error">{errors.email}</div>
                        ) : null}
                      </MaterialInput>

                      <MaterialInput
                        label="Enter Password"
                        className="materialInput"
                        name="password"
                        type="password"
                        touched={touched.password && touched.password}
                        values={values.password && values.password}
                      >
                        <Field type="password" name="password" />
                        {errors.password && touched.password ? (
                          <div className="input-error">{errors.password}</div>
                        ) : null}
                      </MaterialInput>

                      <br />
                      <br />
                      <MaterialButton
                        title={"Login"}
                        bgColor="#fb641b"
                        textColor="#ffffff"
                        style={{
                          margin: "40px 0 20px 0",
                        }}
                        type="submit"
                      />
                      <br />
                      <p style={{ textAlign: "center" }}>OR</p>
                      <MaterialButton
                        title="Request OTP"
                        bgColor="#ffffff"
                        textColor="#2874f0"
                      />
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <div className="subHeader">
        <div className="logo">
          <Link to="/">
            <img src={"./" + flipkartLogo} className="logoimage" alt="Logo" />
          </Link>
          <Link to="/" style={{ marginTop: "-10px" }}>
            <span className="exploreText">Explore</span>
            <span className="plusText">Plus</span>
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/general%2Fgolden-star.png?alt=media&token=486ced0b-f09e-4f38-9401-f6a919ba677d"
              }
              className="goldenStar"
              alt="Golden Star"
            />
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
          {auth.authenticate ? renderLoggingInMenu() : renderNotLoggedInMenu()}
          <DropdownMenu
            style={{}}
            menu={
              <Link className="more">
                <span>More</span>
                <IoIosArrowDown />
              </Link>
            }
            menus={[
              { label: "Notification Preference", href: "/", icon: null },
              { label: "Sell on flipkart", href: "/", icon: null },
              { label: "24x7 Customer Care", href: "/", icon: null },
              { label: "Advertise", href: "/", icon: null },
              { label: "Download App", href: "/", icon: null },
            ]}
          />
          <div>
            <Link className="cart" to="/cart">
              <Cart
                count={cart.cartItems && Object.keys(cart.cartItems).length}
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
