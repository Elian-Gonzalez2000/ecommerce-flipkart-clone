import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProductDetailsById } from "../../actions";
import { genericPublicUrl } from "../../urlConfig";
import Layout from "../../components/Layout";
import { MaterialButton } from "../../components/MaterialUI";
import { IoIosArrowForward, IoIosStar, IoMdCart } from "react-icons/io";
import { BsLightningFill } from "react-icons/bs";
import { BiRupee } from "react-icons/bi";
import "./style.css";
import { addToCart } from "../../actions/cart.action";
import { randomUI } from "../../helpers/randomUI";

function ProductsDetailsPage(props) {
   const dispatch = useDispatch();
   const params = useParams();
   const product = useSelector((state) => state.product.productDetails);
   const [activeImg, setActiveImg] = useState("");

   useEffect(() => {
      const payload = {
         params: {
            productId: params.productId,
         },
      };

      dispatch(getProductDetailsById(payload));
   }, []);

   useEffect(() => {
      if (product.productPictures) {
         //console.log(product);
         setActiveImg(product.productPictures[0].img);
      }
   }, [product]);

   if (product && Object.keys(product).length === 0) {
      return null;
   }

   const handleActiveImg = (img) => {
      console.log(img);
      setActiveImg(img);
   };

   return (
      <Layout>
         {/* {product.name} */}
         <div className="product-descripton-container">
            <div className="flex-row">
               <div className="vertical-image-stack">
                  {product &&
                     product.productPictures.map((thumb, index) => (
                        <div
                           key={thumb._id}
                           className={`thumbnail ${
                              activeImg == thumb.img ? "active" : ""
                           }`}
                           onClick={() => handleActiveImg(thumb.img)}
                        >
                           <img
                              src={genericPublicUrl(thumb.img)}
                              alt={thumb.img}
                           />
                        </div>
                     ))}
               </div>
               <div className="product-desc-container">
                  <div className="product-desc-img-container">
                     <img
                        src={genericPublicUrl(activeImg && activeImg)}
                        alt={`${activeImg}`}
                     />
                  </div>
                  <div className="flex-row">
                     <MaterialButton
                        title="ADD TO CART"
                        bgColor="#ff9f00"
                        textColor="#ffffff"
                        icon={<IoMdCart />}
                        onClick={() => {
                           const { _id, name, price } = product;
                           const img = product.productPictures[0].img;
                           dispatch(addToCart({ _id, name, price, img }));
                        }}
                     />
                     <MaterialButton
                        title="BUY NOW"
                        bgColor="#fb641b"
                        textColor="#ffffff"
                        icon={<BsLightningFill />}
                     />
                  </div>
               </div>
               <div className="breed">
                  <ul>
                     <li>
                        <Link to="#">Home</Link>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <Link to="#">Mobiles</Link>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <Link to="#">Samsung</Link>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <Link to="#">{product && product.name}</Link>
                     </li>
                  </ul>
                  <div className="product-details">
                     <p className="product-title">{product && product.name}</p>
                     <div>
                        <span className="rating-count">
                           4.3 <IoIosStar />
                        </span>
                        <span className="rating-numbers-reviews">
                           72,234 Ratings & 8,140 Reviews
                        </span>
                     </div>
                     <div className="extra-offer">
                        Extra {/* <BiRupee /> */}
                        4500 off{" "}
                     </div>
                     <div className="flex-row price-container">
                        <span className="price">
                           <BiRupee />
                           {product && product.price}
                        </span>
                        <span className="discount" style={{ margin: "0 10px" }}>
                           22% off
                        </span>
                        {/* <span>i</span> */}
                     </div>
                     <div>
                        <p
                           style={{
                              color: "#212121",
                              fontSize: "14px",
                              fontWeight: "600",
                           }}
                        >
                           Available Offers
                        </p>
                        <p style={{ display: "flex" }}>
                           <span
                              style={{
                                 width: "100px",
                                 fontSize: "12px",
                                 color: "#878787",
                                 fontWeight: "600",
                                 marginRight: "20px",
                              }}
                           >
                              Description
                           </span>
                           <span
                              style={{
                                 fontSize: "12px",
                                 color: "#212121",
                              }}
                           >
                              {product && product.description}
                           </span>
                        </p>
                     </div>
                  </div>
               </div>
               {/* product description */}
            </div>
         </div>
      </Layout>
   );
}

export default ProductsDetailsPage;
