import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import "./styles.css";

const Breed = ({ categories, lastCategory = false }) => {
  const { category, parentCategory } = categories;

  return (
    <div className="breed">
      <ul>
        <li>
          <Link to="/" style={{ marginLeft: "0" }}>
            Home
          </Link>
          {parentCategory && <IoIosArrowForward />}
        </li>
        {parentCategory && (
          <li>
            <Link to="#">{parentCategory.name}</Link>
            {lastCategory && category && <IoIosArrowForward />}
          </li>
        )}
        {lastCategory && category && (
          <li>
            <Link to="#">{category.name}</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breed;
