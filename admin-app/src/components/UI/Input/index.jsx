import React from "react";
import { Form } from "react-bootstrap";

/* 
   This component create an input with all the data that need it.
   Use the bootstrap components for styles
*/
const Input = (props) => {
  const {
    label,
    name,
    type,
    placeholder,
    value,
    onChange,
    errorMessage,
    register,
    styles,
    children,
  } = props;

  let input = null;
  switch (type) {
    case "select":
      input = (
        <Form.Group className="mb-3" controlId={`formBasicEmail`}>
          {label && <Form.Label>{label}</Form.Label>}
          <select
            name={name ? name : ""}
            className="form-control "
            value={value}
            onChange={onChange}
          >
            <option value="">{placeholder}</option>
            {children}
          </select>
          <Form.Text className="text-danger">{errorMessage}</Form.Text>
        </Form.Group>
      );
      break;
    case "text":
    default:
      input = (
        <Form.Group
          className="mb-3"
          controlId={`formBasicEmail${self.crypto.randomUUID()}`}
        >
          {label && <Form.Label>{label}</Form.Label>}
          <Form.Control
            name={name ? name : ""}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={props.className}
            {...register}
            style={styles}
          />
          <Form.Text className="text-danger">{errorMessage}</Form.Text>
        </Form.Group>
      );
      break;
  }
  if (input) return input;
};

export default Input;
