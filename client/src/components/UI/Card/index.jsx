import React from "react";
import "./style.css";

function Card({
   headerLeft,
   headerRight,
   cardIcon,
   priceRange,
   classNames,
   ...props
}) {
   return (
      <article className={`card ${classNames ? classNames : ""}`} {...props}>
         {headerLeft && (
            <div className="card-header">
               <div className="header-left">
                  {headerLeft}
                  {cardIcon && cardIcon}
                  {priceRange && priceRange}
               </div>
               {headerRight && (
                  <div className="header-right">{headerRight}</div>
               )}
            </div>
         )}

         {props.children}
      </article>
   );
}

export default Card;
