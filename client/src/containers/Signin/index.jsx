import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Layout from "../../components/Layout";
import Input from "../../components/UI/Input";

const Signin = (props) => {
   return (
      <Layout>
         <Row style={{ marginTop: "3.5rem" }}>
            <Col md={{ span: 6, offset: 3 }}>
               <Form>
                  <Input
                     label="Email Address"
                     placeholder="Email Address..."
                     value=""
                     type="email"
                     onChange={() => {}}
                  />

                  <Input
                     label="Password"
                     placeholder="Password..."
                     value=""
                     type="password"
                     onChange={() => {}}
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

export default Signin;
