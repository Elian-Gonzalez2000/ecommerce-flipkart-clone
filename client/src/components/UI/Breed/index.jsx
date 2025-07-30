import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import "./styles.css";

const Breed = ({ categories, lastCategory = false, showProductsName }) => {
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
            <Link
              to={`/${parentCategory.slug}?cid=${parentCategory._id}&type=details&sort=popularity`}
            >
              {parentCategory.name}
            </Link>
            {lastCategory && category && <IoIosArrowForward />}
          </li>
        )}
        {lastCategory && category && (
          <li>
            <Link
              to={`/${category.slug}?cid=${category._id}&type=details&sort=popularity`}
            >
              {category.name}
            </Link>
            {showProductsName && category && <IoIosArrowForward />}
          </li>
        )}
        {showProductsName && category && (
          <li>
            <span>{showProductsName}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breed;
