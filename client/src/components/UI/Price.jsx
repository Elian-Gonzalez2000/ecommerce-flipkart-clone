import React from "react";
import { BiRupee } from "react-icons/bi";

const Price = (props) => {
   const styles = {
      fontSize: props.fontSize ? props.fontSize : "14px",
      fontWeight: "bold",
      margin: "5px 0",
   };
   return (
      <span style={styles}>
         <BiRupee />
         {props.value}
      </span>
   );
};

export default Price;
