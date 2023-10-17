import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductPage } from "../../../actions";
import getParams from "../../../utilities/getParams";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { genericPublicUrl } from "../../../urlConfig";
import Card from "../../../components/UI/Card";
import { Link } from "react-router-dom";

function ProductPage(props) {
   const dispatch = useDispatch();
   const product = useSelector((state) => state.product);
   const { page } = product;

   useEffect(() => {
      const params = getParams(props.location.search);
      const paylaod = {
         params,
      };
      dispatch(getProductPage(params));
   }, []);

   return (
      <div>
         <h1>{page.title}</h1>
         <Carousel renderThumbs={() => {}}>
            {page.banners &&
               page.banners.map((banner, index) => (
                  <Link
                     key={`${index}-${banner.img}`}
                     style={{ display: "block" }}
                     to={banner.navigateTo}
                  >
                     <img
                        src={genericPublicUrl(banner.img.split("/")[4])}
                        alt=""
                     />
                  </Link>
               ))}
         </Carousel>
         <div
            style={{
               display: "flex",
               justifyContent: "center",
               flexWrap: "wrap",
               margin: "1rem 0",
            }}
         >
            {page.products &&
               page.products.map((product, index) => (
                  <Card key={`${index}-${product.img}`}>
                     <img
                        src={genericPublicUrl(product.img.split("/")[4])}
                        alt=""
                     />
                  </Card>
               ))}
         </div>
      </div>
   );
}

export default ProductPage;
