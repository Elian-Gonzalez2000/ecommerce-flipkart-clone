import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { confirmSignup } from "../../actions";

const SignupConfirm = () => {
  // const { token } = useParams();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(confirmSignup(token));
  // }, []);

  return (
    <Container>
      <p class="alert-error">&#x2611; Cuenta confirmada correctamente</p>
    </Container>
  );
};

export default SignupConfirm;
