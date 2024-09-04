import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Layout from "../../components/Layout";
import Input from "../../components/UI/Input";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../../actions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loader from "../../components/UI/Loader/Loader";

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const Signup = (props) => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.error) alert(user.error.message);
  }, [user.error]);

  const userSignup = (data) => {
    const { firstName, lastName, email, password } = data;
    const user = {
      firstName,
      lastName,
      email,
      password,
    };

    dispatch(signup(user));
  };

  if (auth.authenticate) {
    return <Navigate to={"/"} replace={true} />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Layout>
      <Row style={{ marginTop: "4.5rem" }}>
        {user.loading && <Loader styles={{ width: "4rem", height: "4rem" }} />}
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(userSignup)}>
            <Row>
              <Col md={6}>
                <Input
                  label="First Name"
                  placeholder="First Name..."
                  type="text"
                  register={register("firstName")}
                  errorMessage={errors.firstName?.message}
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Last Name"
                  placeholder="Last Name..."
                  type="text"
                  register={register("lastName")}
                  errorMessage={errors.lastName?.message}
                />
              </Col>
            </Row>
            <Input
              label="Email Address"
              placeholder="Email Address..."
              type="email"
              register={register("email")}
              errorMessage={errors.email?.message}
            />
            <Input
              label="Password"
              placeholder="Password..."
              type="password"
              register={register("password")}
              errorMessage={errors.password?.message}
            />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

export default Signup;
