import React, { useEffect } from "react";
import "./style.css";
import Card from "../UI/Card";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySlug } from "../../actions";
import { Link } from "react-router-dom";
import { BiRupee } from "react-icons/bi";

const PremiumProducts = () => {
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductsBySlug("Samsung"));
  }, []);
  return (
    <>
      <Card headerLeft={"Premium Products"} classNames={"premium-products"}>
        {product.products &&
          product.products.map((prod) => {
            if (prod.price >= 20000)
              return (
                <Link
                  key={prod._id}
                  to={`/${prod.slug}/${prod._id}/p`}
                  className="premium-products-card"
                >
                  <picture>
                    <img
                      src={prod.productPictures[0].imgUrl}
                      alt={`${prod.name} image`}
                    />
                  </picture>
                  <p>{`The Best of Samsung`}</p>
                  <p style={{ fontWeight: "bolder" }}>
                    {"From "}
                    <BiRupee />
                    {`${prod.price}`}
                  </p>
                </Link>
              );
          })}
      </Card>
    </>
  );
};

export default PremiumProducts;
