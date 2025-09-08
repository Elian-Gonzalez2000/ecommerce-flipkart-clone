import { Modal, Button } from "react-bootstrap";
import { createPortal } from "react-dom";

const FormularyModal = ({
  size = "lg",
  show,
  handleClose,
  modalTitle,
  buttons,
  children,
  onSubmitForm,
  buttonDisabled,
  ...rest
}) => {
  return (
    <>
      {createPortal(
        <Modal size={size} show={show} onHide={handleClose}>
          {modalTitle && (
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
          )}
          <Modal.Body>{children}</Modal.Body>
          {onSubmitForm && (
            <Modal.Footer>
              <Button
                {...rest}
                variant="primary"
                style={{ backgroundColor: "#333" }}
                className="btn-sm"
                onClick={onSubmitForm}
                disabled={buttonDisabled ? buttonDisabled : false}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          )}
        </Modal>,
        document.getElementById("modal")
      )}
    </>
  );
};

export default FormularyModal;
