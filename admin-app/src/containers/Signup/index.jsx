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

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const Signup = (props) => {
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("");
  // const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!user.loading) {
  //     setFirstName("");
  //     setLastName("");
  //     setEmail("");
  //     setPassword("");
  //   }
  // }, [user.loading]);

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
        {user.loading && <p>Loading...</p>}
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(userSignup)}>
            <Row>
              <Col md={6}>
                <Input
                  label="First Name"
                  placeholder="First Name..."
                  /* value={firstName} */
                  type="text"
                  /* onChange={(e) => {
                    setFirstName(e.target.value);
                    console.log(firstName);
                  }} */
                  register={register("firstName")}
                />
                <p>{errors.firstName?.message}</p>
              </Col>
              <Col md={6}>
                <Input
                  label="Last Name"
                  placeholder="Last Name..."
                  // value={lastName}
                  type="text"
                  // onChange={(e) => setLastName(e.target.value)}
                  register={register("lastName")}
                />
                <p>{errors.lastName?.message}</p>
              </Col>
            </Row>
            <Input
              label="Email Address"
              placeholder="Email Address..."
              // value={email}
              type="email"
              // onChange={(e) => setEmail(e.target.value)}
              register={register("email")}
            />
            <p>{errors.email?.message}</p>

            <Input
              label="Password"
              placeholder="Password..."
              // value={password}
              type="password"
              // onChange={(e) => setPassword(e.target.value)}
              register={register("password")}
            />
            <p>{errors.password?.message}</p>
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
