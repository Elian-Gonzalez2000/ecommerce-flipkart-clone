import React, { useEffect } from "react";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllCategory } from "../../actions";
import { Link } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const MenuHeader = () => {
  const category = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  // Renderiza el mega menú de subcategorías
  const renderMegaMenu = (children) => (
    <div className="mega-menu">
      {children.map((subcat) => (
        <>
          <div
            className="mega-menu-item mega-menu-subcategory"
            key={subcat._id}
          >
            <Link
              className="mega-menu-title"
              to={`/${subcat.slug}?cid=${subcat._id}&type=${subcat.type}`}
            >
              {subcat.name}
            </Link>
          </div>
          {subcat.children && subcat.children.length > 0 && (
            <>
              {subcat.children.map((child) => (
                <div className="mega-menu-item" key={child._id}>
                  <Link
                    to={`/${child.slug}?cid=${child._id}&type=${child.type}`}
                  >
                    {child.name}
                  </Link>
                </div>
              ))}
            </>
          )}
        </>
      ))}
    </div>
  );

  // Renderiza las categorías principales
  const renderCategories = (categoryList) =>
    categoryList.map((cat) => (
      <li key={cat._id} className="menu-item">
        <span className="menu-link">
          <Link
            to={`/${cat.slug}?cid=${cat._id}&type=${cat.type}`}
            className="main-category-link"
          >
            {cat.name}
          </Link>
          {cat.children && cat.children.length > 0 && (
            <BsChevronDown className="chevron-icon" />
          )}
        </span>
        {cat.children &&
          cat.children.length > 0 &&
          renderMegaMenu(cat.children)}
      </li>
    ));

  return (
    <div className="menu-header">
      <ul className="menu-list">
        {category.categories.length > 0
          ? renderCategories(category.categories)
          : null}
      </ul>
    </div>
  );
};

export default MenuHeader;
