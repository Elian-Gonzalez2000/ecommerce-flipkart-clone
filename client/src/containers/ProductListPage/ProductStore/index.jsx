import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, Link } from "react-router-dom";
import { getProductsBySlug } from "../../../actions";
import Card from "../../../components/UI/Card";
import { BiRupee } from "react-icons/bi";
import Rating from "../../../components/UI/Rating";
import Price from "../../../components/UI/Price";
import "./style.css";
import Loader from "../../../components/UI/Loader";
import { Helmet } from "react-helmet";
import Skeleton from "../../../components/UI/Skeleton";
import { randomUI } from "../../../helpers/randomUI";
import getParams from "../../../utilities/getParams";

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
  const pathname = useLocation().pathname;
  const slug = useLocation().pathname.substring(1);
  const params = getParams(useLocation().search);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductsBySlug(slug));
  }, [slug]);
  //console.log(useLocation(), params);
  return (
    <>
      <Helmet>
        <title>
          {`${slug} Online at Best Prices and Offers in India | 01-Dec-24`}
        </title>
        <meta
          property="og:title"
          content="Shopping Cart | Flipkart.com Clone"
        />
        <meta
          property="og:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${slug}`}
        />
        <meta
          name="twitter:url"
          content={`https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/${slug}`}
        />
        <meta name="twitter:title" content={`${slug} | Flipkart.com Clone`} />
      </Helmet>
      {product.loading && <Loader />}
      {product.productsByPrice && !product.loading ? (
        Object.keys(product.productsByPrice).map((key) => {
          return (
            <Card
              classNames={"product-card"}
              headerLeft={`${slug} Mobile under `}
              headerRight={
                <Link
                  to={`${pathname}?cid=${params.cid}&type=details&range=5000`}
                  classNames="card-button"
                >
                  View All
                </Link>
              }
              priceRange={priceRange[key]}
              cardIcon={<BiRupee />}
              style={{
                width: "calc(100% - 20px)",
                margin: "40px auto",
                border: "none",
              }}
              key={randomUI()}
            >
              <article style={{ display: "flex" }}>
                {product.productsByPrice[key].map((product) => (
                  <Link
                    to={`/${product.slug}/${product._id}/p`}
                    className="product-container"
                    key={randomUI()}
                  >
                    <picture className="product-img-container">
                      <img
                        src={product.productPictures[0].imgUrl}
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
        })
      ) : (
        <>
          <SkelentonLoaderProducts />
          <SkelentonLoaderProducts />
          <SkelentonLoaderProducts />
        </>
      )}
    </>
  );
}

function SkelentonLoaderProducts() {
  return (
    <Card
      classNames={"product-card"}
      headerLeft={
        <Skeleton
          width="350px"
          height="30px"
          /* styles={{ marginBottom: ".5rem" }} */
        />
      }
      headerRight={
        <Skeleton
          width="120px"
          height="30px"
          /* styles={{ marginBottom: ".5rem" }} */
        />
      }
      style={{
        width: "calc(100% - 20px)",
        margin: "40px auto",
        border: "none",
      }}
      key={randomUI()}
    >
      <article style={{ display: "flex" }}>
        <Link to={`#`} className="product-container">
          <picture className="product-img-container">
            <Skeleton
              width="150px"
              height="150px"
              styles={{ marginBottom: ".5rem" }}
            />
          </picture>
          <div className="product-info">
            <Skeleton
              width="90%"
              height="20px"
              styles={{ margin: "0 auto", marginBottom: ".5rem" }}
            />
          </div>
        </Link>
        <Link to={`#`} className="product-container">
          <picture className="product-img-container">
            <Skeleton
              width="150px"
              height="150px"
              styles={{ marginBottom: ".5rem" }}
            />
          </picture>
          <div className="product-info">
            <Skeleton
              width="90%"
              height="20px"
              styles={{ margin: "0 auto", marginBottom: ".5rem" }}
            />
          </div>
        </Link>
        <Link to={`#`} className="product-container">
          <picture className="product-img-container">
            <Skeleton
              width="150px"
              height="150px"
              styles={{ marginBottom: ".5rem" }}
            />
          </picture>
          <div className="product-info">
            <Skeleton
              width="90%"
              height="20px"
              styles={{ margin: "0 auto", marginBottom: ".5rem" }}
            />
          </div>
        </Link>
        <Link to={`#`} className="product-container">
          <picture className="product-img-container">
            <Skeleton
              width="150px"
              height="150px"
              styles={{ marginBottom: ".5rem" }}
            />
          </picture>
          <div className="product-info">
            <Skeleton
              width="90%"
              height="20px"
              styles={{ margin: "0 auto", marginBottom: ".5rem" }}
            />
          </div>
        </Link>
      </article>
    </Card>
  );
}

export default ProductStore;
