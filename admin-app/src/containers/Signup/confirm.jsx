import React from "react";

const SignupConfirm = () => {
  return (
    <div style={styles}>
      <p style={messageStyles}>&#x2611; Cuenta confirmada correctamente</p>
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
  backgroundColor: "green",
  textAlign: "center",
  padding: "2rem 1.5rem",
  borderRadius: "4px",
  color: "#fff",
};

export default SignupConfirm;
