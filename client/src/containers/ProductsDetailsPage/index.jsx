import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProductDetailsById } from "../../actions";
import Layout from "../../components/Layout";
import { MaterialButton } from "../../components/MaterialUI";
import {
  IoIosArrowForward,
  IoIosStar,
  IoMdCart,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { BsLightningFill } from "react-icons/bs";
import "./style.css";
import { addToCart } from "../../actions/cart.action";
import Loader from "../../components/UI/Loader";
import Price from "../../components/UI/Price";
import { Helmet } from "react-helmet";
import Breed from "../../components/UI/Breed";
import Skeleton from "../../components/UI/Skeleton";
import { findCategory } from "../../helpers/findCategory";

function ProductsDetailsPage(props) {
  const dispatch = useDispatch();
  const params = useParams();
  const product = useSelector((state) => state.product.productDetails);
  const categoryData = useSelector((state) => state.category.categories);
  const isLoading = useSelector((state) => state.product.loading);
  const [activeImg, setActiveImg] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [category, setCategory] = useState(null);

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
      setActiveImg(product.productPictures[0].imgUrl);
    }
  }, [product]);

  // Función para verificar si se puede hacer scroll
  const checkScrollButtons = (container) => {
    if (container) {
      setCanScrollUp(container.scrollTop > 0);
      setCanScrollDown(
        container.scrollTop <
          container.scrollHeight - container.clientHeight - 61
      );
    }
  };

  // Función para hacer scroll hacia arriba
  const handleScrollUp = () => {
    const container = document.querySelector(".thumbnail-container");

    if (container && canScrollUp) {
      container.scrollTop -= 61.22 * 4; // Altura de thumbnail + margin
      setTimeout(() => checkScrollButtons(container), 100);
    }
  };

  // Función para hacer scroll hacia abajo
  const handleScrollDown = () => {
    const container = document.querySelector(".thumbnail-container");

    if (container && canScrollDown) {
      container.scrollTop += 61.22 * 4; // Altura de thumbnail + margin
      setTimeout(() => checkScrollButtons(container), 100);
    }
  };

  // Verificar botones cuando cambia el producto
  useEffect(() => {
    const container = document.querySelector(".thumbnail-container");

    if (container) {
      checkScrollButtons(container);
      // Agregar event listener para scroll
      const handleScroll = () => {
        checkScrollButtons(container);
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [product]);

  useEffect(() => {
    if (categoryData.length > 0) {
      setCategory(findCategory(categoryData, "_id", product.category, true));
    }
  }, [categoryData]);

  if (product && Object.keys(product).length === 0) {
    return null;
  }

  const handleActiveImg = (img) => {
    setActiveImg(img);
  };

  return (
    <Layout style={{ maxWidth: "1360px" }}>
      <Helmet>
        <title>{"Products Online at Best Prices and Offers in India"}</title>
        <meta
          property="og:title"
          content="Shopping Cart | Flipkart.com Clone"
        />
        <meta
          property="og:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${params.productSlug}/${params.productId}/p`}
        />
        <meta
          name="twitter:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${params.productSlug}/${params.productId}/p`}
        />
        <meta
          name="twitter:title"
          content={`${params.productSlug} | Flipkart.com Clone`}
        />
      </Helmet>
      {isLoading && <Loader />}
      {/* {product.name} */}
      <div className="product-descripton-container">
        <div
          className="vertical-image-stack"
          onClick={(e) => e.preventDefault()}
        >
          <div
            className={`arrow-slide ${!canScrollUp ? "disabled" : ""}`}
            style={{ top: "0", position: "absolute" }}
            onClick={(e) => {
              e.preventDefault();
              handleScrollUp();
            }}
          >
            <IoIosArrowUp />
          </div>
          <div className="thumbnail-container">
            {product &&
              product.productPictures.map((thumb) => (
                <div
                  key={thumb._id}
                  className={`thumbnail ${
                    activeImg == thumb.imgUrl ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleActiveImg(thumb.imgUrl);
                  }}
                >
                  <img src={thumb.imgUrl} alt={thumb.name} />
                </div>
              ))}
          </div>
          <div
            className={`arrow-slide ${!canScrollDown ? "disabled" : ""}`}
            style={{ bottom: "0", position: "absolute" }}
            onClick={(e) => {
              e.preventDefault();
              handleScrollDown();
            }}
          >
            <IoIosArrowDown />
          </div>
        </div>
        <div className="product-desc-container">
          <div className="product-desc-img-container">
            <img src={activeImg} alt={`${activeImg}`} />
          </div>
          <div className="product-detail-buttons-container">
            <MaterialButton
              title="ADD TO CART"
              bgColor="#ff9f00"
              textColor="var(--white-color)"
              fontWeight="600"
              icon={<IoMdCart />}
              onClick={() => {
                console.log(product);
                const { _id, name, price } = product;
                const cartItemImg = product.productPictures[0];
                dispatch(addToCart({ _id, name, price, cartItemImg }));
              }}
            />
            <MaterialButton
              title="BUY NOW"
              bgColor="#fb641b"
              textColor="var(--white-color)"
              fontWeight="600"
              icon={<BsLightningFill />}
            />
          </div>
        </div>

        <div className="product-details-info-container">
          {category?.category ? (
            <Breed
              categories={{ ...category }}
              lastCategory={true}
              showProductsName={product.name}
            />
          ) : (
            <Skeleton
              width="175px"
              height="20px"
              styles={{ marginBottom: ".5rem" }}
            />
          )}
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
              {product && <Price className="price" value={product.price} />}
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
    </Layout>
  );
}

export default ProductsDetailsPage;
