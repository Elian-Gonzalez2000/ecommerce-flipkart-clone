import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";

/**
 * @author Rizwan Khan
 * @function
 **/

const Modal = (props) => {
  if (!props.visible) {
    return null;
  }
  return (
    <>
      <div className="modalFixedBg">
        <div style={{ position: "relative" }}>
          <div className="modalClose" onClick={props.onClose}>
            X
          </div>
          <div className="modalContainer">{props.children}</div>
        </div>
      </div>
    </>
  );
};

const MaterialInput = (props) => {
  const {
    label,
    name,
    type,
    value,
    onChange,
    rightElement,
    touched,
    values,
    children,
  } = props;

  return (
    <div className={`materialInput`}>
      <label
        className={`label ${touched || values ? "focus" : ""}`}
        htmlFor={name ? name : ""}
        style={{
          top: 0,
          lineHeight: "none",
        }}
      >
        {label && `${label}`}
      </label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
        {rightElement ? rightElement : null}
      </div>
    </div>
  );
};

const MaterialButton = ({ classNames, ...props }) => {
  const onClick = () => {
    props.onClick && props.onClick();
  };

  return (
    <div>
      <button
        className={`${"material-button"} ${classNames ? classNames : ""}`}
        style={{
          backgroundColor: props?.bgColor,
          color: props?.textColor,
          width: props?.width,
          padding: props?.padding,
        }}
        onClick={onClick && onClick}
        type={props.type ? props.type : "button"}
      >
        {props.icon && props.icon}
        {props.title && props.title}
      </button>
    </div>
  );
};

const DropdownMenu = (props) => {
  return (
    <div className="headerDropdownContainer">
      {props.menu}
      <div className="dropdown">
        <div className="upArrow"></div>
        {props.firstMenu}
        <ul className="headerDropdownMenu">
          {props.menus &&
            props.menus.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick && item.onClick();
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const Anchor = (props) => {
  return (
    <button {...props} className="anchor-button">
      {props.name}
    </button>
  );
};

const Breed = (props) => {
  return (
    <div className="breed">
      <ul>
        {props.breed &&
          props.breed.map((item, index) => (
            <li key={index}>
              <Link to={item.href}>{item.name}</Link>
              {props.breedIcon}
            </li>
          ))}
      </ul>
    </div>
  );
};

export { Modal, MaterialInput, MaterialButton, DropdownMenu, Anchor, Breed };
