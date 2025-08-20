const Product = require("../models/product.js");
const Category = require("../models/category.js");
const env = require("dotenv");
const multer = require("multer");
const shortid = require("shortid");
const slugify = require("slugify");
const axios = require("axios");
var fs = require("fs");
const { log } = require("console");

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
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            res.status(400).json({ error });
          }

          if (products == false)
            return res
              .status(400)
              .json({ message: "The category doesn't have products" });

          // Fix the empty caategory in scraper and chage the next line to "store"
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

exports.getProductsBySearchQuery = async (req, res) => {
  try {
    const { query } = req.query;

    // Validación de la query
    if (!query || query.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "La consulta de búsqueda es requerida" });
    }

    // Limpiar y normalizar la query
    const cleanQuery = query.trim().replace(/\s+/g, " ");
    const queryWords = cleanQuery.split(" ").filter((word) => word.length > 0);

    // Crear múltiples patrones de búsqueda
    const searchPatterns = [];

    // 1. Búsqueda exacta
    searchPatterns.push({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { description: { $regex: cleanQuery, $options: "i" } },
        { slug: { $regex: cleanQuery, $options: "i" } },
      ],
      weight: 100,
    });

    // 2. Búsqueda por prefijos
    const prefixPatterns = queryWords.map((word) => ({
      $or: [
        { name: { $regex: `^${word}`, $options: "i" } },
        { description: { $regex: `^${word}`, $options: "i" } },
        { slug: { $regex: `^${word}`, $options: "i" } },
      ],
      weight: 80,
    }));
    searchPatterns.push(...prefixPatterns);

    // 3. Búsqueda fuzzy (tolerancia de 1-2 caracteres)
    const fuzzyPatterns = queryWords
      .map((word) => {
        if (word.length < 3) return null; // Solo para palabras de 3+ caracteres

        // Crear variaciones fuzzy
        const fuzzyVariations = [];
        for (let i = 0; i < word.length; i++) {
          // Eliminar un carácter
          const withoutChar = word.slice(0, i) + word.slice(i + 1);
          if (withoutChar.length >= 2) fuzzyVariations.push(withoutChar);

          // Cambiar un carácter por otro similar
          const similarChars = {
            a: "e",
            e: "a",
            i: "y",
            o: "u",
            u: "o",
            s: "z",
            z: "s",
            c: "k",
            k: "c",
            f: "v",
            v: "f",
          };
          const char = word[i];
          if (similarChars[char]) {
            const withSimilar =
              word.slice(0, i) + similarChars[char] + word.slice(i + 1);
            fuzzyVariations.push(withSimilar);
          }
        }

        return {
          $or: [
            {
              name: { $regex: `(${fuzzyVariations.join("|")})`, $options: "i" },
            },
            {
              description: {
                $regex: `(${fuzzyVariations.join("|")})`,
                $options: "i",
              },
            },
            {
              slug: { $regex: `(${fuzzyVariations.join("|")})`, $options: "i" },
            },
          ],
          weight: 30,
        };
      })
      .filter(Boolean);
    searchPatterns.push(...fuzzyPatterns);

    // 4. Búsqueda por palabras individuales
    const wordPatterns = queryWords.map((word) => ({
      $or: [
        { name: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } },
        { slug: { $regex: word, $options: "i" } },
      ],
      weight: 50,
    }));
    searchPatterns.push(...wordPatterns);

    // Construir el filtro de búsqueda combinado
    const searchFilter = {
      $and: [
        { quantity: { $gt: 0 } }, // Solo productos disponibles
        { $or: searchPatterns.map((pattern) => pattern.$or).flat() },
      ],
    };

    // Realizar la búsqueda con scoring de relevancia
    const products = await Product.find(searchFilter)
      .select(
        "_id name price quantity slug description productPictures category"
      )
      .populate({
        path: "category",
        select: "_id name",
      })
      .lean()
      .exec();

    // Calcular puntuación de relevancia para cada producto
    const scoredProducts = products.map((product) => {
      let score = 0;
      const searchText =
        `${product.name} ${product.description} ${product.slug}`.toLowerCase();

      // Puntuación por coincidencia exacta
      if (searchText.includes(cleanQuery.toLowerCase())) {
        score += 100;
      }

      // Puntuación por palabras individuales
      queryWords.forEach((word) => {
        if (product.name.toLowerCase().includes(word.toLowerCase())) {
          score += 60;
        } else if (
          product.description.toLowerCase().includes(word.toLowerCase())
        ) {
          score += 40;
        } else if (product.slug.toLowerCase().includes(word.toLowerCase())) {
          score += 30;
        }
      });

      // Puntuación por prefijos
      queryWords.forEach((word) => {
        if (product.name.toLowerCase().startsWith(word.toLowerCase())) {
          score += 20;
        }
      });

      return { ...product, relevanceScore: score };
    });

    // Ordenar por relevancia (mayor puntuación primero)
    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Remover el score de la respuesta final
    const finalProducts = scoredProducts.map(
      ({ relevanceScore, ...product }) => product
    );

    if (finalProducts.length > 0) {
      return res.status(200).json({ products: finalProducts });
    } else {
      return res.status(400).json({ error: "No se encontraron productos" });
    }
  } catch (error) {
    console.error("Error en búsqueda de productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
