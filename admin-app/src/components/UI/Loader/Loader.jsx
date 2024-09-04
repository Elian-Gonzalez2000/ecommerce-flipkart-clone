import Spinner from "react-bootstrap/Spinner";
import "./styles.css";

function Loader({ animation = "border", size = "", variant = "dark", styles }) {
  return (
    <div className="loader">
      <Spinner
        animation={`${animation}`}
        role="status"
        variant={`${variant}`}
        size={`${size}`}
        style={styles}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;
