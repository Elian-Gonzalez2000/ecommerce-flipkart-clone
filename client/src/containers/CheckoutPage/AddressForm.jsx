import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../actions";
import { MaterialButton, MaterialInput } from "../../components/MaterialUI";
import { BsFillArrowLeftSquareFill, BsX } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Formik and Yup schema validation
const addressFormSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z]+$/, "Only admit letters")
    .required("Required"),
  mobileNumber: Yup.string()
    .typeError("Solo se permiten números")
    .matches(/^[0-9]+$/, "Must be a number")
    .length(10, "Must have 10 digits")
    .required("Required"),
  pinCode: Yup.string()
    .matches(/^[0-9]+$/, "Must be a number")
    .required("Required"),
  locality: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  cityDistrictTown: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  landmark: Yup.string().required("Required"),
  alternatePhone: Yup.string()
    .typeError("Solo se permiten números")
    .matches(/^[0-9]+$/, "Must be a number")
    .length(10, "Must have 10 digits")
    .required("Required"),
});

const AddressForm = (props) => {
  const user = useSelector((state) => state.user);
  const { initialData } = props;
  if (initialData) console.log(initialData);

  const [formData, setFormData] = useState(null);
  const [id, setId] = useState(initialData ? initialData._id : "");
  const [name, setName] = useState(initialData ? initialData.name : "");
  /* const [mobileNumber, setMobileNumber] = useState(
    initialData ? initialData.mobileNumber : ""
  ); */
  const [pinCode, setPinCode] = useState(
    initialData ? initialData.pinCode : ""
  );
  const [locality, setLocality] = useState(
    initialData ? initialData.locality : ""
  );
  const [address, setAddress] = useState(
    initialData ? initialData.address : ""
  );
  const [cityDistrictTown, setCityDistrictTown] = useState(
    initialData ? initialData.cityDistrictTown : ""
  );
  const [state, setState] = useState(initialData ? initialData.state : "");
  const [landmark, setLandmark] = useState(
    initialData ? initialData.landmark : ""
  );
  const [alternatePhone, setAlternatePhone] = useState(
    initialData ? initialData.alternatePhone : ""
  );
  const [addressType, setAddressType] = useState(
    initialData ? initialData.addressType : ""
  );
  const [submitFlag, setSubmitFlag] = useState(false);
  const dispatch = useDispatch();

  const inputContainer = {
    width: "100%",
    marginRight: 10,
  };

  const onAddressSubmit = (values) => {
    console.log(values);
    const {
      name,
      mobileNumber,
      pinCode,
      locality,
      address,
      cityDistrictTown,
      state,
      landmark,
      alternatePhone,
      addressType,
    } = values;
    const payload = {
      address: {
        name,
        mobileNumber,
        pinCode,
        locality,
        address,
        cityDistrictTown,
        state,
        landmark,
        alternatePhone,
        addressType,
      },
    };
    console.log(payload);
    if (id) {
      payload.address._id = id;
    }
    setFormData(payload);
    dispatch(addAddress(payload));
    setSubmitFlag(true);
  };

  useEffect(() => {
    console.log("address count: ", user.address);
    if (submitFlag) {
      const {
        name,
        mobileNumber,
        pinCode,
        locality,
        address,
        cityDistrictTown,
        state,
        landmark,
        alternatePhone,
        addressType,
      } = formData.address;
      console.log("where we are ", formData);
      let _address = {};
      if (id) {
        _address = {
          _id: id,
          name,
          mobileNumber,
          pinCode,
          locality,
          address,
          cityDistrictTown,
          state,
          landmark,
          alternatePhone,
          addressType,
        };
      } else {
        _address = user.address.slice(user.address.length - 1)[0];
      }
      props.onSubmitForm(_address);
    }
  }, [user.address]);

  const renderAddressForm = () => {
    return (
      <Formik
        initialValues={{
          name: initialData ? initialData.name : "",
          mobileNumber: initialData ? initialData.mobileNumber : "",
          pinCode: initialData ? initialData.pinCode : "",
          locality: initialData ? initialData.locality : "",
          address: initialData ? initialData.address : "",
          cityDistrictTown: initialData ? initialData.cityDistrictTown : "",
          state: initialData ? initialData.state : "",
          landmark: initialData ? initialData.landmark : "",
          alternatePhone: initialData ? initialData.alternatePhone : "",
          addressType: initialData ? initialData.addressType : "",
        }}
        validationSchema={addressFormSchema}
        onSubmit={onAddressSubmit}
      >
        {({ errors, touched, values }) => (
          <Form>
            {console.log(values)}
            <div className="flexRow">
              <MaterialInput
                label={"name"}
                name="name"
                type="name"
                touched={touched.name && touched.name}
                values={values.name && values.name}
                style={inputContainer}
                /* onChange={(e) => {
                    console.log(e.target.value);

                    setName(e.target.value);
                  }} */
              >
                <Field name="name" />
                {errors.name && touched.name ? (
                  <div className="input-error">{errors.name}</div>
                ) : null}
              </MaterialInput>

              <MaterialInput
                label={"10-digit mobile number"}
                name="mobileNumber"
                type="mobileNumber"
                touched={touched.mobileNumber && touched.mobileNumber}
                values={values.mobileNumber && values.mobileNumber}
                style={inputContainer}
                /* onChange={(e) => setMobileNumber(e.target.value)} */
              >
                <Field name="mobileNumber" />
                {errors.mobileNumber && touched.mobileNumber ? (
                  <div className="input-error">{errors.mobileNumber}</div>
                ) : null}
              </MaterialInput>
            </div>
            <div className="flexRow">
              <MaterialInput
                label={"Pincode"}
                name="pinCode"
                type="pinCode"
                touched={touched.pinCode && touched.pinCode}
                values={values.pinCode && values.pinCode}
                style={inputContainer}
                /* onChange={(e) => setPinCode(e.target.value)} */
              >
                <Field name="pinCode" />
                {errors.pinCode && touched.pinCode ? (
                  <div className="input-error">{errors.pinCode}</div>
                ) : null}
              </MaterialInput>
              <MaterialInput
                label={"Locality"}
                name="locality"
                type="locality"
                touched={touched.locality && touched.locality}
                values={values.locality && values.locality}
                style={inputContainer}
              >
                <Field name="locality" />
                {errors.locality && touched.locality ? (
                  <div className="input-error">{errors.locality}</div>
                ) : null}
              </MaterialInput>
            </div>
            <div className="flexRow">
              <MaterialInput
                label={"Address"}
                name="address"
                type="address"
                touched={touched.address && touched.address}
                values={values.address && values.address}
                style={inputContainer}
              >
                <Field name="address" />
                {errors.address && touched.address ? (
                  <div className="input-error">{errors.address}</div>
                ) : null}
              </MaterialInput>
            </div>
            <div className="flexRow">
              <MaterialInput
                label={"City/District/Town"}
                name="cityDistrictTown"
                type="cityDistrictTown"
                touched={touched.cityDistrictTown && touched.cityDistrictTown}
                values={values.cityDistrictTown && values.cityDistrictTown}
                style={inputContainer}
              >
                <Field name="cityDistrictTown" />
                {errors.cityDistrictTown && touched.cityDistrictTown ? (
                  <div className="input-error">{errors.cityDistrictTown}</div>
                ) : null}
              </MaterialInput>

              <MaterialInput
                label={"State"}
                name="state"
                type="state"
                touched={touched.state && touched.state}
                values={values.state && values.state}
                style={inputContainer}
                /* onChange={(e) => setState(e.target.value)} */
              >
                <Field name="state" />
                {errors.state && touched.state ? (
                  <div className="input-error">{errors.state}</div>
                ) : null}
              </MaterialInput>
            </div>
            <div className="flexRow">
              <MaterialInput
                label={"Landmark (Optional)"}
                name="landmark"
                type="landmark"
                touched={touched.landmark && touched.landmark}
                values={values.landmark && values.landmark}
                style={inputContainer}
                /* onChange={(e) => setLandmark(e.target.value)} */
              >
                <Field name="landmark" />
                {errors.landmark && touched.landmark ? (
                  <div className="input-error">{errors.landmark}</div>
                ) : null}
              </MaterialInput>

              <MaterialInput
                label={"Alternate Phone (Optional)"}
                name="alternatePhone"
                type="alternatePhone"
                touched={touched.alternatePhone && touched.alternatePhone}
                values={values.alternatePhone && values.alternatePhone}
                style={inputContainer}
                /* onChange={(e) => setAlternatePhone(e.target.value)} */
              >
                <Field name="alternatePhone" />
                {errors.alternatePhone && touched.alternatePhone ? (
                  <div className="input-error">{errors.alternatePhone}</div>
                ) : null}
              </MaterialInput>
            </div>
            <div>
              <label>Address Type</label>
              <div className="flexRow">
                <label>
                  <Field
                    type="radio"
                    /* onClick={() => setAddressType("home")} */
                    name="addressType"
                    value="home"
                    checked={values ? values.addressType === "home" : false}
                  />
                  <span>Home</span>
                </label>
                <label>
                  <Field
                    type="radio"
                    /* onClick={() => setAddressType("work")} */
                    name="addressType"
                    value="work"
                    checked={values ? values.addressType === "work" : false}
                  />
                  <span>Work</span>
                </label>
              </div>
            </div>
            <div className="flexRow">
              <MaterialButton
                title="SAVE AND DELIVER HERE"
                type="submit"
                style={{
                  width: "250px",
                  margin: "20px 0",
                }}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  if (props.withoutLayout) {
    return <div>{renderAddressForm()}</div>;
  }

  return (
    <div className="checkout-step" style={{ background: "#f5faff" }}>
      <div className={"checkout-header"} style={{ cursor: "default" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="step-number">+</span>
          <span className="step-title">{"ADD NEW ADDRESS"}</span>
          <span
            className="step-cancel step-number"
            onClick={(e) => {
              e.preventDefault();
              props.onCancel();
            }}
          >
            <BsX />
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "0 60px",
          paddingBottom: "20px",
        }}
      >
        {renderAddressForm()}
      </div>
    </div>
  );
};

export default AddressForm;
