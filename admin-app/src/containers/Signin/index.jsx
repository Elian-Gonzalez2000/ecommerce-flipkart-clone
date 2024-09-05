import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Layout from "../../components/Layout";
import Input from "../../components/UI/Input";
import { login } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loader from "../../components/UI/Loader/Loader";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const Signin = () => {
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.error) setError(auth.error);
  }, [auth.error]);

  const userLogin = (data) => {
    const { email, password } = data;
    const user = {
      email,
      password,
    };
    dispatch(login(user));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  if (auth.authenticate) {
    console.log("Signin: ", auth);
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <Layout>
      <Container>
        {auth.loading && <Loader styles={{ width: "4rem", height: "4rem" }} />}
        <Row style={{ marginTop: "4.5rem" }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit(userLogin)}>
              <Input
                label="Email Address"
                placeholder="Email Address..."
                register={register("email")}
                type="email"
                errorMessage={errors.email?.message}
              />

              <Input
                label="Password"
                placeholder="Password..."
                register={register("password")}
                type="password"
                errorMessage={errors.password?.message}
              />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
        {error && <p className="mt-4 text-danger">{error}</p>}
      </Container>
    </Layout>
  );
};

export default Signin;
