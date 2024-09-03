import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";

const SignupConfirm = () => {
  return (
    <Container>
      <p class="alert-error">&#x2611; Cuenta confirmada correctamente</p>
    </Container>
  );
};

export default SignupConfirm;
