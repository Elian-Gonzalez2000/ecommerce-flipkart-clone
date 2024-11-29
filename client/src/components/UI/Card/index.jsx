import React from "react";
import "./style.css";

function Card({
  header = true,
  headerLeft,
  headerRight,
  cardIcon,
  priceRange,
  classNames,
  ...props
}) {
  return (
    <article className={`card ${classNames ? classNames : ""}`} {...props}>
      {header && (
        <div className="card-header">
          {headerLeft && (
            <div className="header-left">
              {headerLeft}
              {cardIcon && cardIcon}
              {priceRange && priceRange}
            </div>
          )}
          {headerRight && headerRight}
        </div>
      )}

      {props.children}
    </article>
  );
}

export default Card;
