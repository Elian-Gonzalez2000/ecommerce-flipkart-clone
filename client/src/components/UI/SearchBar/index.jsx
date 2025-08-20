import { useState, useRef } from "react";
import "./styles.css";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchBar, setSearchBar] = useState("");
  const searchBarInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchBarInput = (e) => {
    if (e.type == "change") {
      //console.log(searchBarInputRef.current.value);
    }
    if (e.type == "click" || e.key === "Enter") {
      const searchValue = searchBarInputRef.current.value;
      if (searchValue.trim())
        navigate(`/search?q=${searchValue}&sort=popularity`);
      /* console.log("Click: ", searchBarInputRef.current.value); */
    }
  };
  return (
    <div className="search-input-container">
      <input
        ref={searchBarInputRef}
        className="search-input"
        placeholder={"search for products, brands and more"}
        onChange={(e) => handleSearchBarInput(e)}
        onKeyUp={(e) => handleSearchBarInput(e)}
      />
      <div
        className="search-icon-container"
        onClick={(e) => handleSearchBarInput(e)}
      >
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
