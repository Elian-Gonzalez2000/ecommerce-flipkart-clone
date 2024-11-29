import React from "react";
import { BiRupee } from "react-icons/bi";
import formatCurrency from "../../utilities/formatCurrency";

const Price = (props) => {
  const styles = {
    fontSize: props.fontSize ? props.fontSize : "14px",
    fontWeight: "bold",
    margin: "5px 0",
  };
  return (
    <span
      className={props.className ? props.className : ""}
      style={!props.className ? styles : {}}
    >
      {/* <BiRupee /> */}
      {formatCurrency(
        { currency: "INR", value: props.value },
        { trailingZeroDisplay: "stripIfInteger" }
      )}
    </span>
  );
};

export default Price;
