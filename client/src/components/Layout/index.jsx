import React from "react";
import Header from "../Header";
import MenuHeader from "../MenuHeader";

const Layout = (props) => {
   return (
      <>
         <Header />
         <MenuHeader />
         <section className={`container-large ${props.className}`}>
            {props.children}
         </section>
      </>
   );
};

export default Layout;
