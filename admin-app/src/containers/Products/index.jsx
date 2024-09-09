import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import { addProduct, deleteProductById, editProductById } from "../../actions";
import Modal from "../../components/UI/Modal";
import { genericPublicUrl } from "../../urlConfig";
import { randomUI } from "../../helpers/randomUI";
import {
  deleteFirebaseImage,
  uploadImage,
} from "../../firebase/firebase.client";
import "./styles.css";
import { getDownloadURL } from "firebase/storage";

const Products = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productPictures, setProductPictures] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [task, setTask] = useState([]);
  const [productDetailModal, setProductDetailModal] = useState(false);
  const [imgURL, setImgUrl] = useState([]);
  const category = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      setButtonDisabled(false);
    }
  }, [task]);

  const handleClose = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("quantity", quantity);
    form.append("price", price);
    form.append("description", description);
    form.append("category", categoryId);
    for (let pic of productPictures) {
      form.append("productPicture", pic);
    }
    const data = {
      name,
      quantity,
      price,
      description,
      category: categoryId,
      images: imgURL,
    };
    dispatch(addProduct(form, data));
    //console.log(imgURL);
    setShowAdd(false);
    setName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setImgUrl([]);
    setProductPictures([]);
  };

  const handleCloseEdit = () => {
    setName(prod.name);
    setQuantity(prod.quantity);
    setPrice(prod.price);
    setDescription(prod.description);
    setCategoryId(prod.category);
    setImgUrl(prod.productPictures);
    const data = {
      name,
      quantity,
      price,
      description,
      category: categoryId,
      images: imgURL,
    };
    dispatch(editProductById(data));
    //console.log(imgURL);
    setShowEdit(false);
    setName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setImgUrl([]);
    setProductPictures([]);
  };

  const handleShow = (modal) => {
    if (modal === "edit") return setShowEdit(true);
    if (modal === "add") return setShowAdd(true);
  };

  const handleProductPictures = (e) => {
    // Save multiples files
    if (!e.target.files || !e.target.files.length) return alert("Algo");
    const files = Array.from(e.target.files);
    const promises = files.map(async (file) => {
      console.log(file);
      const fileImage = await uploadImage(file);
      setProductPictures([...productPictures, file]);
      return fileImage;
    });
    Promise.all(promises).then((res) => {
      console.log(res);
      setTask([...task, ...res]);
      setImgUrl([...imgURL, ...res]);
    });
    // Save only 1 file
    /* const fileImage = uploadImage(e.target.files[0]);
    setTask(fileImage);
    setProductPictures([...productPictures, e.target.files[0]]);
    console.log(e.target.files, productPictures); */
  };

  const handleDeleteImage = (img) => {
    // console.log(img);
    const imgFiltered = imgURL.filter(
      (filterImg) => filterImg.name === img.name
    );
    const imgURLFiltered = imgURL.filter(
      (filterImg) => filterImg.name !== img.name
    );
    if (imgFiltered) setImgUrl([...imgURLFiltered]);
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

  const renderProducts = () => {
    return (
      <Table responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {product.products.length > 0
            ? product.products.map((prod, index) => {
                return (
                  <tr
                    key={prod._id}
                    onClick={() => showProductDetailsModal(prod)}
                  >
                    <td>{index + 1}</td>
                    <td>{prod.name}</td>
                    <td>{prod.price}</td>
                    <td>{prod.quantity}</td>
                    <td>{prod.category.name}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showProductDetailsModal(prod);
                          console.log(e.target);
                        }}
                      >
                        Info
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showEditproductModal(prod);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const payload = {
                            productId: prod._id,
                          };
                          dispatch(deleteProductById(payload));
                        }}
                      >
                        del
                      </button>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </Table>
    );
  };

  const renderAddProductModal = () => {
    return (
      <Modal
        show={showAdd}
        onSubmit={handleClose}
        handleClose={() => {
          setShowAdd(false);
          setName("");
          setQuantity("");
          setPrice("");
          setDescription("");
          setCategoryId("");
          setImgUrl([]);
          setProductPictures([]);
        }}
        modalTitle={"Add new product"}
        buttonDisabled={buttonDisabled}
      >
        <Input
          label="Name"
          value={name}
          placeholder={"Product Name"}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Quantity"
          value={quantity}
          placeholder={"Quantity"}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          label="Price"
          value={price}
          placeholder={"Price"}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Description"
          value={description}
          placeholder={"Description"}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option>Select Category</option>
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {productPictures.length > 0
          ? productPictures.map((pic, index) => (
              <div key={randomUI()}>{pic.name}</div>
            ))
          : null}
        <input
          type="file"
          name="productPicture"
          accept="image/*"
          multiple
          onChange={handleProductPictures}
        />
        <div className="pictures-container mt-3">
          {imgURL
            ? imgURL.map((img) => {
                // console.log(img);
                return (
                  // i miss the property img.imgUrl to img.imgURL, i stay with this for two ours trying work
                  <picture key={self.crypto.randomUUID()}>
                    <img src={`${img.imgUrl}`} alt={`${img.imgUrl}`} />
                  </picture>
                );
              })
            : null}
        </div>
      </Modal>
    );
  };

  const renderEditProductModal = () => {
    return (
      <Modal
        show={showEdit}
        onSubmit={handleCloseEdit}
        handleClose={() => {
          setShowEdit(false);
          setName("");
          setQuantity("");
          setPrice("");
          setDescription("");
          setCategoryId("");
          setImgUrl([]);
          setProductPictures([]);
        }}
        modalTitle={"Edit product"}
        buttonDisabled={buttonDisabled}
      >
        <Input
          label="Name"
          value={name}
          placeholder={"Product Name"}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Quantity"
          value={quantity}
          placeholder={"Quantity"}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          label="Price"
          value={price}
          placeholder={"Price"}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Description"
          value={description}
          placeholder={"Description"}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option>{categoryId.name}</option>
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {/* {productPictures.length > 0
          ? productPictures.map((pic, index) => (
              <div key={randomUI()}>{pic.name}</div>
            ))
          : null} */}
        <input
          type="file"
          name="productPicture"
          accept="image/*"
          multiple
          onChange={handleProductPictures}
        />
        <div className="pictures-container mt-3 ">
          {imgURL
            ? imgURL.map((img) => {
                return (
                  // i miss the property img.imgUrl to img.imgURL, i stay with this for two ours trying work
                  <picture
                    key={self.crypto.randomUUID()}
                    className="position-relative"
                    onClick={() => handleDeleteImage(img)}
                  >
                    <span className="cancel-btn">X</span>
                    <img src={`${img.imgUrl}`} alt={`${img.name}`} />
                  </picture>
                );
              })
            : null}
        </div>
      </Modal>
    );
  };

  const handleCloseProductDetailModal = () => {
    setProductDetailModal(false);
  };

  const showProductDetailsModal = (prod) => {
    setProductDetail(prod);
    setProductDetailModal(true);
  };

  const showEditproductModal = (prod) => {
    console.log([...prod.productPictures]);
    setName(prod.name);
    setQuantity(prod.quantity);
    setPrice(prod.price);
    setDescription(prod.description);
    setCategoryId(prod.category);
    setImgUrl([...prod.productPictures]);
    handleShow("edit");
  };

  const renderShowProductDetailsModal = () => {
    if (!productDetail) {
      return null;
    }
    return (
      <Modal
        show={productDetailModal}
        handleClose={handleCloseProductDetailModal}
        modalTitle={"Product Details"}
        size="lg"
      >
        <Row>
          <Col md="6">
            <strong>Name</strong>
            <p>{productDetail.name}</p>
          </Col>
          <Col md="6">
            <strong>Price</strong>
            <p>{productDetail.price}</p>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <strong>Quantity</strong>
            <p>{productDetail.quantity}</p>
          </Col>
          <Col md="6">
            <strong>Category</strong>
            <p>{productDetail.category.name}</p>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <strong>Description</strong>
            <p>{productDetail.description}</p>
          </Col>
        </Row>
        <Row>
          <Col className="pictures-container">
            {productDetail?.productPictures.map((picture) => {
              return (
                <div key={randomUI()}>
                  <img
                    src={`${picture.imgUrl}`}
                    alt={`Image URL: ${picture.img}`}
                  />
                </div>
              );
            })}
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <Layout sidebar>
      <Row>
        <Col md={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h3>Product</h3>
            <Button
              onClick={() => {
                handleShow("add");
                renderAddProductModal();
              }}
            >
              Add
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>{renderProducts()}</Col>
      </Row>
      {showAdd ? renderAddProductModal() : ""}
      {showEdit ? renderEditProductModal() : ""}
      {productDetailModal ? renderShowProductDetailsModal() : ""}
    </Layout>
  );
};

export default Products;
