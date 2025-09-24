import { Modal, Table } from "react-bootstrap";
import Layout from "../../components/Layout";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../firebase/firebase.client";
import FormularyModal from "../../components/UI/FormularyModal";
import Input from "../../components/UI/Input";
import { randomUI } from "../../helpers/randomUI";
import { addProduct } from "../../actions";
import {
  createHomepageCard,
  getAllCardsHomepages,
  updateHomepageCard,
} from "../../actions/homepageCards";

function Homepage() {
  return (
    <Layout sidebar>
      <HomepageModal />;
    </Layout>
  );
}

function HomepageModal() {
  const [values, setValues] = useState({
    title: "",
    category: "",
    products: [],
    currentProductName: "",
  });
  const [editFormValues, setEditFormValues] = useState({
    title: "",
    category: "",
    products: [],
    currentProductName: "",
    homepageId: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    category: "",
    products: "",
  });
  const [productPictures, setProductPictures] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [imgURL, setImgUrl] = useState([]);
  const category = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const homepage = useSelector((state) => state.homepage);
  const [showAddHomepageModal, setShowAddHomepageModal] = useState(false);
  const [showEditHomepageModal, setShowEditHomepageModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCardsHomepages());
  }, []);

  const handleSubmitAddHomepageModal = () => {
    const requestCardData = {
      title: values.title,
      categoryId: values.category,
      products: values.products,
    };
    const checkFormErrors = {};
    if (!values.title.trim()) checkFormErrors.title = "The card need a title";
    if (!values.category.trim())
      checkFormErrors.category = "The card need a category";
    if (values.products.length === 0)
      checkFormErrors.products = "The card need show products";

    setFormErrors(checkFormErrors);

    if (Object.keys(checkFormErrors).length === 0) {
      dispatch(createHomepageCard(requestCardData));
      setShowAddHomepageModal(false);
    }
  };

  const handleSubmitEditHomepageModal = () => {
    const requestCardData = {
      title: editFormValues.title,
      categoryId: editFormValues.category,
      products: editFormValues.products,
      homepageId: editFormValues.homepageId,
    };
    const checkFormErrors = {};
    if (!editFormValues.title.trim())
      checkFormErrors.title = "The card need a title";
    if (!editFormValues.category.trim())
      checkFormErrors.category = "The card need a category";
    if (editFormValues.products.length === 0)
      checkFormErrors.products = "The card need show products";

    setFormErrors(checkFormErrors);

    if (Object.keys(checkFormErrors).length === 0) {
      dispatch(updateHomepageCard(requestCardData));
      setShowEditHomepageModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((state) => ({ ...state, [name]: value }));
  };

  const handleOpenEditHomepageModal = (homepage) => {
    console.log(homepage);
    setEditFormValues({
      ...editFormValues,
      title: homepage.title,
      category: homepage.category._id,
      products: homepage.products.map((prod) => prod._id),
      homepageId: homepage._id,
    });
    setShowEditHomepageModal(true);
  };

  const cancelOnEditSelectedProducts = (e) => {
    const productIdFiltered = editFormValues.products.filter(
      (prod) => prod === e.target.dataset.productid
    );

    const updateProductGroupOnState = editFormValues.products.filter(
      (prod) => prod !== e.target.dataset.productid
    );
    if (productIdFiltered)
      setEditFormValues({
        ...editFormValues,
        products: [...updateProductGroupOnState],
      });
  };

  const cancelOnAddSelectedProducts = (e) => {
    const productIdFiltered = values.products.filter(
      (prod) => prod === e.target.dataset.productid
    );

    const updateProductGroupOnState = values.products.filter(
      (prod) => prod !== e.target.dataset.productid
    );
    if (productIdFiltered)
      setValues({ ...values, products: [...updateProductGroupOnState] });
  };

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };

  const renderAllCardsTable = () => {
    return (
      <Table responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Products Counted</th>
          </tr>
        </thead>
        <tbody>
          {homepage.groupOfCards.map((homepage, index) => {
            const categoryName = homepage.category.name
              ? homepage.category.name
              : "No asigned";
            const productCount = homepage.products.length;
            return (
              <tr key={homepage._id || randomUI()}>
                <td>{index + 1}</td>
                <td>{homepage.title}</td>
                <td>{categoryName}</td>
                <td>{productCount}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Info
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditHomepageModal(homepage);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    del
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const RenderAddHomepageModal = () => {
    return (
      <FormularyModal
        show={showAddHomepageModal}
        modalTitle={"Add new card of products in homepage"}
        handleClose={() => setShowAddHomepageModal(false)}
        onSubmitForm={handleSubmitAddHomepageModal}
      >
        <Input
          label="Title"
          name="title"
          placeholder={"Product title"}
          value={values.title}
          errorMessage={formErrors?.title ? formErrors.title : ""}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />

        <Input
          label="Select category"
          type="select"
          name="category"
          placeholder="Select Category"
          value={values.category}
          errorMessage={formErrors?.category ? formErrors.category : ""}
          onChange={(e) => setValues({ ...values, category: e.target.value })}
        >
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </Input>
        <Input
          label="Select card products"
          type="select"
          name="products"
          placeholder="Select card products"
          value={values.currentProductName}
          errorMessage={formErrors?.products ? formErrors.products : ""}
          onChange={(e) => {
            if (!values.products.includes(e.target.value)) {
              setValues({
                ...values,
                products: [...values.products, e.target.value],
                currentProductName: e.target.value,
              });
            }
          }}
        >
          {product.products.map((option) => (
            <option
              key={option._id}
              value={option._id}
              onClick={(e) => console.log(e.target)}
            >
              {option.name}
            </option>
          ))}
        </Input>
        <div>
          {values.products?.length > 0 ? (
            product.products
              .filter((prod) => values.products.includes(prod._id))
              .map((prod) => (
                <p key={randomUI()} className="position-relative">
                  {prod.name}
                  <span
                    data-productid={prod._id}
                    className="cancel-btn"
                    onClick={(e) => cancelOnAddSelectedProducts(e)}
                  >
                    X
                  </span>
                </p>
              ))
          ) : (
            <p>Need products to show in the card homepage</p>
          )}
        </div>
      </FormularyModal>
    );
  };

  const RenderEditHomepageModal = () => {
    return (
      <FormularyModal
        show={showEditHomepageModal}
        modalTitle={"Add new card of products in homepage"}
        handleClose={() => setShowEditHomepageModal(false)}
        onSubmitForm={handleSubmitEditHomepageModal}
      >
        <Input
          label="Title"
          name="title"
          placeholder={"Product title"}
          value={editFormValues.title}
          errorMessage={formErrors?.title ? formErrors.title : ""}
          onChange={(e) =>
            setEditFormValues({ ...editFormValues, title: e.target.value })
          }
        />

        <Input
          label="Select category"
          type="select"
          name="category"
          placeholder="Select Category"
          value={editFormValues.category}
          errorMessage={formErrors?.category ? formErrors.category : ""}
          onChange={(e) =>
            setEditFormValues({ ...editFormValues, category: e.target.value })
          }
        >
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </Input>
        <Input
          label="Select card products"
          type="select"
          name="products"
          placeholder="Select card products"
          value={editFormValues.currentProductName}
          errorMessage={formErrors?.products ? formErrors.products : ""}
          onChange={(e) => {
            if (!editFormValues.products.includes(e.target.value)) {
              setEditFormValues({
                ...editFormValues,
                products: [...editFormValues.products, e.target.value],
                currentProductName: e.target.value,
              });
            }
          }}
        >
          {product.products.map((option) => (
            <option
              key={option._id}
              value={option._id}
              onClick={(e) => console.log(e.target)}
            >
              {option.name}
            </option>
          ))}
        </Input>
        <div>
          {editFormValues.products?.length > 0 ? (
            product.products
              .filter((prod) => editFormValues.products.includes(prod._id))
              .map((prod) => (
                <p key={randomUI()} className="position-relative">
                  {prod.name}
                  <span
                    data-productid={prod._id}
                    className="cancel-btn"
                    onClick={(e) => cancelOnEditSelectedProducts(e)}
                  >
                    X
                  </span>
                </p>
              ))
          ) : (
            <p>Need products to show in the card homepage</p>
          )}
        </div>
      </FormularyModal>
    );
  };

  return (
    <section>
      <button onClick={() => setShowAddHomepageModal(true)}> Open modal</button>
      {showAddHomepageModal ? RenderAddHomepageModal() : ""}
      {showEditHomepageModal ? RenderEditHomepageModal() : ""}
      {homepage.groupOfCards.length > 0 ? renderAllCardsTable() : "No Cards"}
    </section>
  );
}

export default Homepage;
