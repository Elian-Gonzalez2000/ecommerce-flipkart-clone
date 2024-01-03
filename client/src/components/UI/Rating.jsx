import React from "react";
import { IoIosStar } from "react-icons/io";

const styles = {
   iconStyles: { verticalAlign: "baseline", paddingTop: "2px" },
   contentStyles: {
      display: "inline-block",
      background: "#388e3c",
      color: "#fff",
      fontWeight: "500",
      fontSize: "12px",
      borderRadius: "3px",
      padding: "2px 5px",
      letterSpacing: ".5px",
   },
};

const Rating = (props) => {
   return (
      <span style={styles.contentStyles}>
         {props.value} <IoIosStar style={styles.iconStyles} />
      </span>
   );
};

export default Rating;
