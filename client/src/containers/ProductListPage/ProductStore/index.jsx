import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useMatch, useParams } from "react-router-dom";
import { getProductsBySlug } from "../../../actions";
import Layout from "../../../components/Layout";
import { genericPublicUrl } from "../../../urlConfig";

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
   //const match = useMatch();
   const params = useParams();
   const dispatch = useDispatch();
   useEffect(() => {
      const { match } = props;
      dispatch(getProductsBySlug(slug));
      console.log(match);
   }, [slug]);
   console.log(useLocation(), product, params);
   return (
      <>
         {product.productsByPrice &&
            Object.keys(product.productsByPrice).map((key, index) => {
               return (
                  <div className="card">
                     <div className="card-header">
                        <div>
                           {slug} mobile under {priceRange[key]}
                        </div>
                     </div>
                     <div style={{ display: "flex" }}>
                        {product.productsByPrice[key].map((product) => (
                           <div className="product-container">
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
                                 <div>
                                    <span>4.3</span>&nbsp;
                                    <span>3353</span>
                                 </div>
                                 <div className="product-price">
                                    {product.price}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               );
            })}
      </>
   );
}

export default ProductStore;
