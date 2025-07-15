import "./styles.css";
import { IoIosSearch } from "react-icons/io";

function SearchBar() {
  return (
    <div className="search-input-container">
      <input
        className="search-input"
        placeholder={"search for products, brands and more"}
      />
      <div className="search-icon-container">
        <IoIosSearch
          style={{
            color: "#2874f0",
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;
