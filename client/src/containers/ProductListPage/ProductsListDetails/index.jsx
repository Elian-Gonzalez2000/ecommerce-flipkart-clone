import { useEffect, useState } from "react";
import "./styles.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySlug } from "../../../actions";
import Card from "../../../components/UI/Card/index.jsx";
import Price from "../../../components/UI/Price.jsx";
import { randomUI } from "../../../helpers/randomUI.js";
import assured from "../../../images/assured-flipkart.png";
import Skeleton from "../../../components/UI/Skeleton/index.jsx";
import Pagination from "../../../components/Pagination/index.jsx";
import getParams from "../../../utilities/getParams.js";
import Breed from "../../../components/UI/Breed/index.jsx";
import {
  sortPriceLowToHigh,
  sortPriceHighToLow,
  sortNewestFirst,
} from "../../../helpers/sort.js";
import { findCategory } from "../../../helpers/findCategory.js";

function ProductsListDetails() {
  const productData = useSelector((state) => state.product);
  const categoryData = useSelector((state) => state.category.categories);
  const pathname = useLocation().pathname;
  const slug = useLocation().pathname.substring(1);
  const params = getParams(useLocation().search);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const itemsPerPage = 5;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentProducts = products && products.slice(start, end);

  const getActiveSortClass = (sortType) => {
    const currentSort = params.sort || "popularity";
    return currentSort === sortType ? "active-filter" : "";
  };

  useEffect(() => {
    dispatch(getProductsBySlug(slug));
  }, [slug]);

  useEffect(() => {
    if (categoryData.length > 0) {
      setCategory(findCategory(categoryData, "_id", params.cid, true));
    }
  }, [categoryData]);

  useEffect(() => {
    if (productData.products.length > 0) {
      if (params.sort === "price_asc") {
        setProducts(sortPriceLowToHigh(productData.products));
      } else if (params.sort === "price_desc") {
        setProducts(sortPriceHighToLow(productData.products));
      } else if (params.sort === "recency_desc") {
        setProducts(sortNewestFirst(productData.products));
      } else {
        setProducts(productData.products);
      }
      console.log(products);
    }
  }, [productData, params.sort]);

  useEffect(() => {
    // Scroll al top cada vez que cambia la página
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  /* product.products[0].name */
  return (
    <div className="products-list-details">
      <aside>
        <div>
          <b>Filters</b> <span>Clear All</span>{" "}
        </div>
      </aside>
      <section>
        {category?.category ? (
          <Breed categories={{ ...category }} />
        ) : (
          <Skeleton
            width="175px"
            height="20px"
            styles={{ marginBottom: ".5rem" }}
          />
        )}
        {/*  <div>category</div> Here shows similar categories (Watch original page) */}
        <div style={{ marginBottom: "0.5rem" }} className="pagination-info">
          {productData.products.length > 0 && category?.category ? (
            <>
              <b>{category?.parentCategory.name}</b>{" "}
              <span>
                (Showing {start + 1} – {end} products of{" "}
                {productData.products.length} products)
              </span>
            </>
          ) : (
            <Skeleton
              width="340px"
              height="20px"
              styles={{ marginBottom: ".5rem" }}
            />
          )}
        </div>
        <div className="sort-by">
          {productData.products.length > 0 ? (
            <>
              <b style={{ fontWeight: "500", marginLeft: "0" }}>Sort by</b>{" "}
              <Link
                to={`${pathname}?cid=${params.cid}&type=${params.type}&sort=popularity`}
                className={getActiveSortClass("popularity")}
              >
                Popularity
              </Link>{" "}
              <Link
                to={`${pathname}?cid=${params.cid}&type=${params.type}&sort=price_asc`}
                className={getActiveSortClass("price_asc")}
              >
                Price -- Low to High
              </Link>{" "}
              <Link
                to={`${pathname}?cid=${params.cid}&type=${params.type}&sort=price_desc`}
                className={getActiveSortClass("price_desc")}
              >
                Price -- High to Low
              </Link>{" "}
              <Link
                to={`${pathname}?cid=${params.cid}&type=${params.type}&sort=recency_desc`}
                className={getActiveSortClass("recency_desc")}
              >
                Newest First
              </Link>
            </>
          ) : (
            <Skeleton
              width="450px"
              height="31.5px"
              styles={{ marginBottom: ".5rem" }}
            />
          )}
        </div>
        {productData.products.length > 0 && products ? (
          currentProducts.map((prod) => {
            return (
              <Card header={false} key={randomUI()}>
                <Link
                  className="card-content-container"
                  to={`/${prod.slug}/${prod._id}/p`}
                >
                  <div className="card-image" style={{ margin: "0 1rem" }}>
                    <img src={prod.productPictures[0].imgUrl} alt={prod.name} />{" "}
                    {/* <span>Add to compare</span> */}
                  </div>{" "}
                  <div className="card-content">
                    <div>
                      <b style={{ fontWeight: "500" }}>{prod.name}</b>
                    </div>
                    <div>
                      <Price
                        className={"card-content-price"}
                        value={prod.price}
                      />
                      <picture>
                        <img src={assured} alt="Assured" />
                      </picture>
                    </div>
                  </div>
                </Link>
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
        {productData.products.length ? (
          <Pagination
            totalItems={productData.products.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            infoPages={true}
          />
        ) : (
          <></>
        )}
      </section>
    </div>
  );
}

function SkelentonLoaderProducts() {
  return (
    <Card header={false} key={randomUI()}>
      <div className="card-content-container" to={`#`}>
        <div className="card-image" style={{ margin: "0 1rem" }}>
          <Skeleton
            width="160px"
            height="200px"
            styles={{ margin: "0 11px" }}
          />
          {/* <span>Add to compare</span> */}
        </div>{" "}
        <div className="card-content">
          <div>
            <Skeleton
              width="90%"
              height="20px"
              styles={{ marginBottom: ".5rem" }}
            />
            <Skeleton
              width="90%"
              height="20px"
              styles={{ marginBottom: ".5rem" }}
            />
          </div>
          <div>
            <Skeleton width="90%" height="32px" />
            <picture>
              <img src={""} alt="" />
            </picture>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProductsListDetails;
