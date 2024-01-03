import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, Link } from "react-router-dom";
import { getProductsBySlug } from "../../../actions";
import Layout from "../../../components/Layout";
import { genericPublicUrl } from "../../../urlConfig";
import Card from "../../../components/UI/Card";
import { BiRupee } from "react-icons/bi";
import { MaterialButton } from "../../../components/MaterialUI";
import Rating from "../../../components/UI/Rating";
import Price from "../../../components/UI/Price";
import "./style.css";
import Loader from "../../../components/UI/Loader";

function ProductStore(props) {
   const product = useSelector((state) => state.product);
   const auth = useSelector((state) => state.auth);
   const [priceRange, setPriceRange] = useState({
      under5k: 5000,
      under10k: 10000,
      under15k: 15000,
      under20k: 20000,
      under30k: 30000,
   });
   const slug = useLocation().pathname.substring(1);
   const params = useParams();
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getProductsBySlug(slug));
   }, [slug]);
   console.log(useLocation(), product, params);
   return (
      <>
         {product.loading && <Loader />}
         {product.productsByPrice &&
            Object.keys(product.productsByPrice).map((key) => {
               return (
                  <Card
                     classNames={"product-card"}
                     headerLeft={`${slug} Mobile under `}
                     headerRight={
                        <MaterialButton
                           classNames="card-button"
                           title="View all"
                        />
                     }
                     priceRange={priceRange[key]}
                     cardIcon={<BiRupee />}
                     style={{
                        width: "calc(100% - 20px)",
                        margin: "40px auto",
                        border: "none",
                     }}
                     key={self.crypto.randomUUID()}
                  >
                     <article style={{ display: "flex" }}>
                        {product.productsByPrice[key].map((product) => (
                           <Link
                              to={`/${product.slug}/${product._id}/p`}
                              className="product-container"
                              key={self.crypto.randomUUID()}
                           >
                              <picture className="product-img-container">
                                 <img
                                    src={genericPublicUrl(
                                       product.productPictures[0].img
                                    )}
                                    alt={`${product.name} image`}
                                 />
                              </picture>
                              <div className="product-info">
                                 <span>{product.name}</span>
                                 <div>
                                    <Rating value="4.3" />

                                    <span>(3353)</span>
                                 </div>

                                 <Price value={product.price} />
                              </div>
                           </Link>
                        ))}
                     </article>
                  </Card>
               );
            })}
      </>
   );
}

export default ProductStore;
