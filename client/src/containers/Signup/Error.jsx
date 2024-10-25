import React from "react";
import { useParams } from "react-router";

const Error = () => {
  const { error } = useParams();

  return (
    <div style={styles}>
      {error === "TokenExpiredError" ? (
        <p style={messageStyles}>
          &#x2611; Your token has expired. Please return to signup and try
          again.
        </p>
      ) : (
        <p style={messageStyles}>
          &#x2611; Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
};

const styles = {
  height: "100vh",
  weidth: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
};
const messageStyles = {
  backgroundColor: "red",
  textAlign: "center",
  padding: "2rem 1.5rem",
  borderRadius: "4px",
  color: "#fff",
};

export default Error;
