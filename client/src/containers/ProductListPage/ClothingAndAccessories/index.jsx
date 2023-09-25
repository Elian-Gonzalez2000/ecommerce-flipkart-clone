import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySlug } from "../../../actions";
import Card from "../../../components/UI/Card";
import { BiRupee } from "react-icons/bi";
import { Link, useLocation, useParams } from "react-router-dom";
import { genericPublicUrl } from "../../../urlConfig";
import "./style.css";

/**
 * @author
 * @function ClothingAndAccessories
 **/

const ClothingAndAccessories = (props) => {
   const product = useSelector((state) => state.product);
   const params = useParams();
   const dispatch = useDispatch();
   const slug = useLocation().pathname.substring(1);

   useEffect(() => {
      const { match } = props;
      dispatch(getProductsBySlug(slug));
   }, [slug]);
   console.log(useLocation(), product, params);

   return (
      <div style={{ padding: "10px" }}>
         <Card
            style={{
               padding: "10px",
               flexDirection: "row",
            }}
         >
            {product.products.map((product) => (
               <div className="caContainer" key={product._id}>
                  <Link
                     className="caImgContainer"
                     to={`/${product.slug}/${product._id}/p`}
                  >
                     <img
                        src={genericPublicUrl(product.productPictures[0].img)}
                     />
                  </Link>
                  <div>
                     <div className="caProductName">{product.name}</div>
                     <div className="caProductPrice">
                        <BiRupee />
                        {product.price}
                     </div>
                  </div>
               </div>
            ))}
         </Card>
      </div>
   );
};

export default ClothingAndAccessories;
