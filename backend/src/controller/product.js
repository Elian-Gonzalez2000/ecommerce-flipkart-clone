const Product = require("../models/product.js");
const Category = require("../models/category.js");
const env = require("dotenv");
const multer = require("multer");
const shortid = require("shortid");
const slugify = require("slugify");
const axios = require("axios");
var fs = require("fs");

const { API_KEY_IMGBB } = process.env;

exports.createProduct = (req, res) => {
  /* return res.status(200).json({ file: req.files[0], body: req.body }); */
  const { name, price, description, category, quantity, images, createdBy } =
    req.body;
  let productPictures = [];

  if (req.body.images.length > 0) {
    productPictures = images.map((file) => {
      return { imgUrl: file.imgUrl, name: file.name };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.editProductById = (req, res) => {
  const { _id } = req.body;

  const productUpdate = {
    name: req.body.name,
    slug: slugify(req.body.name),
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    quantity: req.body.quantity,
    productPictures: req.body.images,
  };
  Product.findByIdAndUpdate({ _id: _id }, productUpdate, {
    new: true,
  }).exec((error, productUpdated) => {
    if (error) return res.status(400).json({ error });
    if (productUpdated) return res.status(200).json({ productUpdated });
  });
};

exports.getProductsBySlug = (req, res) => {
  // when the category dont have products, it will return nothing
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            res.status(400).json({ error });
          }
          if (!category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
