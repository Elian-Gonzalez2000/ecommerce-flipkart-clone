import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetailsById } from "../../actions";
import { genericPublicUrl } from "../../urlConfig";
import Layout from "../../components/Layout";
import { MaterialButton } from "../../components/MaterialUI";
import { IoIosArrowForward, IoIosStar, IoMdCart } from "react-icons/io";
import "./style.css";
import { addToCart } from "../../actions/cart.action";

function ProductsDetailsPage(props) {
   const dispatch = useDispatch();
   const params = useParams();
   const product = useSelector((state) => state.product.productDetails);

   useEffect(() => {
      const payload = {
         params: {
            productId: params.productId,
         },
      };

      dispatch(getProductDetailsById(payload));
   }, []);
   console.log(product);
   if (product && Object.keys(product).length === 0) {
      return null;
   }

   return (
      <Layout>
         {/* {product.name} */}
         <div className="productDescriptonContainer">
            <div className="flexRow">
               <div className="verticalImageStack">
                  {product &&
                     product.productPictures.map((thumb, index) => (
                        <div className="thumbnail active">
                           <img
                              src={genericPublicUrl(thumb.img)}
                              alt={thumb.img}
                           />
                        </div>
                     ))}
                  {/* <div className="thumbail active">
                     {
                        product.productPictures.map(
                        (thumb, index) => (
                           <img
                              src={genericPublicUrl(thumb.img)}
                              alt={thumb.img}
                           />
                        )
                     )}
                  </div> */}
               </div>
               <div className="productDescContainer">
                  <div className="productDescImgContainer">
                     <img
                        src={genericPublicUrl(
                           product && product.productPictures[0].img
                        )}
                        alt=""
                     />
                  </div>
                  <div className="flexRow">
                     <MaterialButton
                        title="ADD TO CART"
                        bgColor="#ff9f00"
                        textColor="#ffffff"
                        style={{
                           marginRight: "5px",
                        }}
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
                        style={{
                           marginLeft: "5px",
                        }}
                        /* icon={<AiFillThunderbolt />} */
                     />
                  </div>
               </div>
               <div className="breed">
                  <ul>
                     <li>
                        <a href="#">Home</a>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <a href="#">Mobiles</a>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <a href="#">Samsung</a>
                        <IoIosArrowForward />
                     </li>
                     <li>
                        <a href="#">{product && product.name}</a>
                     </li>
                  </ul>
                  <div className="productDetails">
                     <p className="productTitle">{product && product.name}</p>
                     <div>
                        <span className="ratingCount">
                           4.3 <IoIosStar />
                        </span>
                        <span className="ratingNumbersReviews">
                           72,234 Ratings & 8,140 Reviews
                        </span>
                     </div>
                     <div className="extraOffer">
                        Extra {/* <BiRupee /> */}
                        4500 off{" "}
                     </div>
                     <div className="flexRow priceContainer">
                        <span className="price">
                           {/* <BiRupee /> */}
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
