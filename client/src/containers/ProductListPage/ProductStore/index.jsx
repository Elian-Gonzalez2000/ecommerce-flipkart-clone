import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, Link } from "react-router-dom";
import { getProductsBySlug } from "../../../actions";
import Layout from "../../../components/Layout";
import { genericPublicUrl } from "../../../urlConfig";
import Card from "../../../components/UI/Card";
import { BiRupee } from "react-icons/bi";

function ProductStore(props) {
   const product = useSelector((state) => state.product);
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
         {product.productsByPrice &&
            Object.keys(product.productsByPrice).map((key, index) => {
               return (
                  <Card
                     headerLeft={`${slug} mobile under ${priceRange[key]}`}
                     headerRight={<button>View all</button>}
                     style={{
                        width: "calc(100% - 20px)",
                        margin: "40px auto",
                        border: "none",
                     }}
                     key={self.crypto.randomUUID()}
                  >
                     <div style={{ display: "flex" }}>
                        {product.productsByPrice[key].map((product) => (
                           <Link
                              to={`/${product.slug}/${product._id}/p`}
                              style={{ display: "block" }}
                              className="product-container"
                              key={self.crypto.randomUUID()}
                           >
                              <div className="product-img-container">
                                 <img
                                    src={genericPublicUrl(
                                       product.productPictures[0].img
                                    )}
                                    alt={`${product.name} image`}
                                 />
                              </div>
                              <div className="product-info">
                                 <div style={{ margin: "5px 0" }}>
                                    {product.name}
                                 </div>

                                 <div className="product-price">
                                    <BiRupee />
                                    {product.price}
                                 </div>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </Card>
               );
            })}
      </>
   );
}

export default ProductStore;
