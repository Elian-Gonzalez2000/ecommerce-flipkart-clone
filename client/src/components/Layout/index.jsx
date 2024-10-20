import React from "react";
import Header from "../Header";
import MenuHeader from "../MenuHeader";
import Footer from "../Footer";

const Layout = (props) => {
  return (
    <>
      <Header />
      <MenuHeader />
      <section
        className={`container-large ${props.className ? props.className : ""}`}
        style={props.style}
      >
        {props.children}
      </section>
      <Footer />
    </>
  );
};

export default Layout;
