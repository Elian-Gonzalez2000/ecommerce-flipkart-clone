import { Modal } from "react-bootstrap";
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

  const handleSubmit = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((state) => ({ ...state, [name]: value }));
  };

  const cancelOnSelectedProducts = (e) => {
    //console.log(product.products.find((item) => e.target.dataset.productid));
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

  const handleProductPictures = (e) => {
    // Save multiples files
    if (!e.target.files || !e.target.files.length) return alert("Algo");
    const images = Array.from(e.target.files);
    const imagesPromises = images.map(async (file) => {
      console.log(file);
      const fileImage = await uploadImage(file);
      setProductPictures([...productPictures, file]);
      return fileImage;
    });
    Promise.all(imagesPromises).then((res) => {
      console.log(res);
      setImgUrl([...imgURL, ...res]);
    });
    console.log(e.target.files, productPictures);
  };

  const RenderAddHomepageModal = () => {
    return (
      <FormularyModal
        show={showAddHomepageModal}
        modalTitle={"Add new card of products in homepage"}
        handleClose={() => setShowAddHomepageModal(false)}
        onSubmitForm={handleSubmit}
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
                    data-productId={prod._id}
                    className="cancel-btn"
                    onClick={(e) => cancelOnSelectedProducts(e)}
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
      <RenderAddHomepageModal />
      {/* {homepage?.groupOfCards &&
        homepage?.groupOfCards.map((card) => {
          console.log(card);

          return <p>{card.title}</p>;
        })} */}
    </section>
  );
}

export default Homepage;
