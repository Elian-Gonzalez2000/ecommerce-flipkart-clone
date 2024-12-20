import React from "react";
import { Modal, Button } from "react-bootstrap";

/* 
   Create a basic modal with the info we need, that info is recive into the props.children
*/

const NewModal = (props) => {
  const { size, show, handleClose, modalTitle, buttons, ...rest } = props;
  return (
    <Modal size={size} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        {buttons
          ? buttons.map((btn, index) => {
              return (
                <Button key={index} variant={btn.color} onClick={btn.onClick}>
                  {btn.label}
                </Button>
              );
            })
          : props.onSubmit && (
              <Button
                {...rest}
                variant="primary"
                style={{ backgroundColor: "#333" }}
                className="btn-sm"
                onClick={props.onSubmit}
                disabled={props.buttonDisabled && props.buttonDisabled}
              >
                Save Changes
              </Button>
            )}
      </Modal.Footer>
    </Modal>
  );
};

export default NewModal;
