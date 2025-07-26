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

function ProductsListDetails() {
  const productData = useSelector((state) => state.product);
  const categoryData = useSelector((state) => state.category.categories);
  const slug = useLocation().pathname.substring(1);
  const params = getParams(useLocation().search);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(null);
  const itemsPerPage = 5;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentProducts =
    productData.products && productData?.products?.slice(start, end);

  const findCategory = (data, key, value, needParent = false) => {
    function search(categories, parentCategory = null) {
      for (const category of categories) {
        if (category[key] === value) {
          if (needParent) {
            return { category, parentCategory };
          }
          return category;
        }

        if (category.children.length > 0) {
          const result = search(category.children, category);
          if (result) return result;
        }
      }
      return null;
    }
    return search(data);
  };
  useEffect(() => {
    dispatch(getProductsBySlug(slug));
  }, [slug]);

  useEffect(() => {
    if (categoryData.length > 0) {
      setCategory(findCategory(categoryData, "_id", params.cid, true));
      category && console.log(category);
    }
  }, [categoryData]);

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
              <Link to="#" className="active-filter">
                Popularity
              </Link>{" "}
              <Link to="#">Price -- Low to High</Link>{" "}
              <Link to="#">Price -- High to Low</Link>{" "}
              <Link to="#">Newest First</Link>
            </>
          ) : (
            <Skeleton
              width="450px"
              height="31.5px"
              styles={{ marginBottom: ".5rem" }}
            />
          )}
        </div>
        {productData.products.length ? (
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
