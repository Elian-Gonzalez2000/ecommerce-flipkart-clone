const Product = require("../models/product.js");
const Category = require("../models/category.js");
const env = require("dotenv");
const multer = require("multer");
const shortid = require("shortid");
const slugify = require("slugify");
const axios = require("axios");
var fs = require("fs");
const { log, error } = require("console");

exports.getAllHomepagesCards = (req, res) => {
  const { productId, category, user } = req.body;

  Product.findById(productId).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(200).json({ product });
  });
};

exports.getHomepageCard = (req, res) => {
  console.log("ok");

  return res.status(400).json({ message: "ok" });
  const { productId, category, user } = req.body;

  Product.findById(productId).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(200).json({ product });
  });
  return res.status(200).json({ message: "esta bien" });
};
