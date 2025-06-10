const { chromium } = require("playwright");
const Category = require("../models/category.js");
const slugify = require("slugify");
const shortid = require("shortid");
const { get } = require("mongoose");
const Product = require("../models/product.js");
const fetch = require("node-fetch");
const { uploadFile } = require("../config/firebase.config");
const fs = require("fs");
const path = require("path");

/**
 * Añade subcategorías a una categoría padre específica
 * @param {string[]} subCategories - Array de nombres de subcategorías a añadir
 * @param {string} fatherCategorie - Nombre de la categoría padre
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.test - Modo de prueba, no guarda en base de datos
 * @param {boolean} options.skipDuplicates - Omite categorías duplicadas sin error
 * @returns {Promise<{success: boolean, message: string, data?: any, error?: Error}>}
 */

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();

    // Limpiar el nombre del archivo para eliminar caracteres no válidos
    const originalName = url.split("/").pop().split("?")[0]; // Eliminar parámetros de URL
    const cleanFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_"); // Reemplazar caracteres no válidos
    const fileName = `${Date.now()}-${cleanFileName}`;

    // Crear ruta absoluta para el directorio temp
    const tempDir = path.join(__dirname, "../../public/temp");

    // Asegurarse de que el directorio existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      // console.log("Directorio creado:", tempDir);
    }

    const filePath = path.join(tempDir, fileName);

    // Guardar el archivo localmente
    fs.writeFileSync(filePath, buffer);
    // console.log("Imagen descargada:", fileName);

    return {
      filePath,
      size: buffer.length,
      mimetype: response.headers.get("content-type"),
      originalname: fileName,
    };
  } catch (error) {
    console.error("Error descargando imagen:", error);
    return null;
  }
};

const addSubCategories = async (
  subCategories,
  fatherCategorie,
  options = { test: false, skipDuplicates: true }
) => {
  try {
    // Validaciones de entrada
    if (!Array.isArray(subCategories) || subCategories.length === 0) {
      throw new Error("Se requiere un array no vacío de subcategorías");
    }

    if (!fatherCategorie || typeof fatherCategorie !== "string") {
      throw new Error("Se requiere un nombre válido de categoría padre");
    }

    // Buscar categoría padre
    const fatherCategorieFound = await Category.findOne({
      name: fatherCategorie,
    }).exec();

    if (!fatherCategorieFound) {
      return {
        success: false,
        message: `Categoría padre "${fatherCategorie}" no encontrada`,
        error: new Error("FATHER_CATEGORY_NOT_FOUND"),
      };
    }

    // Obtener subcategorías existentes
    const existingSubCategories = await Category.find({
      parentId: fatherCategorieFound._id,
    }).exec();

    const results = {
      added: [],
      skipped: [],
      errors: [],
    };

    // Procesar cada subcategoría
    await Promise.all(
      subCategories.map(async (categorieName) => {
        try {
          // Validar nombre de categoría
          if (!categorieName || typeof categorieName !== "string") {
            throw new Error("Nombre de subcategoría inválido");
          }

          // Verificar duplicados
          const isDuplicate = existingSubCategories.some(
            (existingCat) =>
              existingCat.name.toLowerCase() === categorieName.toLowerCase()
          );

          if (isDuplicate) {
            if (options.skipDuplicates) {
              results.skipped.push({
                name: categorieName,
                reason: "DUPLICATE",
              });
              return;
            } else {
              throw new Error(`La subcategoría "${categorieName}" ya existe`);
            }
          }

          // Crear objeto de categoría
          const categoryObj = {
            name: categorieName,
            slug: `${slugify(categorieName)}`,
            parentId: fatherCategorieFound._id,
          };

          // En modo prueba, solo registrar
          if (options.test) {
            results.added.push({
              ...categoryObj,
              status: "TEST_MODE",
            });
            return;
          }

          // Guardar categoría
          const newCategory = new Category(categoryObj);
          const savedCategory = await newCategory.save();

          results.added.push({
            id: savedCategory._id,
            name: savedCategory.name,
            slug: savedCategory.slug,
          });
        } catch (error) {
          results.errors.push({
            name: categorieName,
            error: error.message,
          });
        }
      })
    );

    // Preparar respuesta
    const hasErrors = results.errors.length > 0;
    const response = {
      success: !hasErrors,
      message: hasErrors
        ? "Algunas subcategorías no pudieron ser procesadas"
        : "Subcategorías procesadas exitosamente",
      data: results,
    };

    if (hasErrors) {
      response.error = new Error("PARTIAL_PROCESSING_ERROR");
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: "Error al procesar subcategorías",
      error,
    };
  }
};

const addChildrenSubCategories = async (
  childrenSubCategories,
  options = { test: false }
) => {
  // Errores identificados:
  // 1. No hay manejo de errores con try/catch
  // 2. El return en options.test termina la función en la primera iteración
  // 3. La comparación getChildrenSubCategorie?.name != categoryObj.name es incorrecta
  // 4. No se verifica si subCategorieId está vacío antes de usarlo
  // 5. No hay validación de entrada para childrenSubCategories

  try {
    if (!childrenSubCategories || !Array.isArray(childrenSubCategories)) {
      console.log("Se requiere un array de subcategorías");
      return;
    }

    let subCategorieId = "";

    for (let i = 0; i < childrenSubCategories.length; i++) {
      const currentItem = childrenSubCategories[i];
      const itemName = currentItem?.innerText?.trim();

      if (!itemName) {
        console.log("Elemento sin texto en índice", i);
        continue;
      }

      if (currentItem?.subCategorieClass) {
        // Buscar la subcategoría padre
        const getSubCategorie = await Category.findOne({ name: itemName });

        if (!getSubCategorie) {
          console.log(`Subcategoría no encontrada: ${itemName}`);
          continue; // Continuar con el siguiente elemento en lugar de terminar
        }

        subCategorieId = getSubCategorie._id;
        console.log(`Procesando subcategoría padre: ${itemName}`);
      } else {
        // Verificar que tengamos un ID de categoría padre válido
        if (!subCategorieId) {
          console.log(`No hay ID de categoría padre para: ${itemName}`);
          continue;
        }

        // Verificar si la categoría hijo ya existe
        const getChildrenSubCategorie = await Category.findOne({
          name: itemName,
        });

        const categoryObj = {
          name: itemName,
          slug: `${slugify(itemName)}`,
          parentId: subCategorieId,
        };

        if (options.test) {
          console.log("Category: ", categoryObj);
          console.log("GetChildrenCategorie: ", getChildrenSubCategorie);
          // No retornamos aquí para permitir que el bucle continúe
        } else {
          // Solo crear si no existe ya
          if (!getChildrenSubCategorie) {
            const cat = new Category(categoryObj);
            try {
              const savedCategory = await cat.save();
              console.log("Categoría hijo guardada:", savedCategory.name);
            } catch (error) {
              console.log("Error al guardar categoría hijo:", error.message);
            }
          } else {
            console.log(`Categoría hijo ya existe: ${itemName}`);
          }
        }
      }
    }

    console.log("Procesamiento de subcategorías hijo completado");
  } catch (error) {
    console.error("Error en addChildrenSubCategories:", error.message);
  }
};

exports.scraperFlipkartCategories = async (
  targetedCategorie,
  save = { subCategories: false, childrenCategories: false }
) => {
  console.log("Scraping Flipkart...");
  if (!targetedCategorie)
    return console.log("Need a expecific targetedCategorie");
  if (!save.subCategories && !save.childrenCategories)
    return console.log(
      "Need expecific paramenter save to subCategories or childrenSubCategories on true"
    );
  if (save.subCategories === true && save.childrenCategories === true)
    return console.log(
      "Need expecific paramenter save to subCategories or childrenSubCategories on true"
    );

  const browser = await chromium.launch({ headless: false }); // Cambia a false para ver qué está pasando
  const page = await browser.newPage();

  // URL de Flipkart
  const url = "https://www.flipkart.com/mobiles/mi~brand/pr?sid=tyy,4io";
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Esperar a que el menú esté disponible
  await page.waitForSelector(".bpjkJb", { timeout: 5000 });

  // Seleccionamos el trigger del menú (padre)
  const menuTrigger = await page.locator(".bpjkJb");

  // Simulamos el hover para desplegar el menú
  // await menuTrigger.hover();
  await page.getByText(`${targetedCategorie}`, { exact: true }).hover();

  // Esperamos a que el menú cargue y se haga visible
  await page.waitForSelector(".jBYtJt.cNDIdi", {
    state: "visible",
    timeout: 5000,
  });
  await page.waitForSelector(".jBYtJt", { state: "visible", timeout: 5000 });

  // Extraemos las categorías
  const categories = await page.$$eval(".bpjkJb", (elements) => {
    return elements.map((el) => {
      const $categories = el.querySelectorAll(".TSD49J");
      const $subCategories = el.querySelectorAll(".jBYtJt.cNDIdi");
      const $childrenSubCategories = el.querySelectorAll(".jBYtJt");
      const categories = Array.from($categories).map((child) =>
        child.innerText.trim()
      );
      const subCategories = Array.from($subCategories).map((child) =>
        child.innerText.trim()
      );
      const childrenSubCategories = Object.values($childrenSubCategories).map(
        (child) => {
          return {
            innerText: child.innerText.trim(),
            subCategorieClass: child.classList.contains("cNDIdi"),
          };
        }
      );

      /* const childrenSubCategories = Array.from($childrenSubCategories).filter(
        (child) =>
          !child.classList.contains("cNDIdi") ? child.innerText.trim() : ""
      ); */

      return {
        categories,
        subCategories,
        childrenSubCategories,
        // childrenSubCategoriesDirty,
      };
    });
  });

  await browser.close();
  const fathersCategories = categories[0].categories;
  const subCategories = categories[0].subCategories;
  const childrenSubCategories = categories[0].childrenSubCategories;
  const fatherCategorieFound = fathersCategories.find(
    (categorie) => categorie === targetedCategorie
  );
  console.log("Father Categorie Found: ", fatherCategorieFound);
  // console.log("Elemento: ", childrenSubCategories);
  if (save.subCategories)
    addSubCategories(subCategories, targetedCategorie, { test: false });

  if (save.childrenCategories)
    addChildrenSubCategories(childrenSubCategories, { test: false });
};

/**
 * Extrae información detallada de un producto específico de Flipkart
 * @param {Object} options - Opciones de configuración
 * @param {string} options.productUrl - URL del producto en Flipkart
 * @param {string} options.categoryId - ID de la categoría a la que pertenece el producto
 * @param {Object} options.save - Opciones de guardado
 * @param {boolean} options.save.product - Si se debe guardar el producto
 * @param {boolean} options.test - Modo de prueba
 * @returns {Promise<{success: boolean, message: string, data?: any, error?: Error}>}
 */
exports.scraperFlipkartProducts = async (
  options = {
    productUrl: "",
    categoryId: "",
    save: { product: false, images: true },
    test: false,
  }
) => {
  try {
    // Validaciones iniciales
    if (!options.productUrl) {
      throw new Error("Se requiere la URL del producto");
    }

    if (!options.categoryId) {
      throw new Error("Se requiere el ID de la categoría");
    }

    // Verificar si la categoría existe
    const category = await Category.findById(options.categoryId).exec();
    if (!category) {
      throw new Error("La categoría especificada no existe");
    }

    console.log("Iniciando navegador...");
    const browser = await chromium.launch({
      headless: !options.test,
      timeout: 60000, // Aumentar timeout para lanzamiento del navegador
    });

    const page = await browser.newPage();

    // Añadir logs para depuración
    console.log("Navegador iniciado correctamente");

    // Configurar timeouts más largos
    await page.setDefaultTimeout(60000);
    await page.setDefaultNavigationTimeout(60000);

    // Configurar interceptación de imágenes para mejor rendimiento
    await page.route("**/*.{png,jpg,jpeg,webp}", (route) => route.abort());

    console.log("Accediendo a la URL del producto...");
    try {
      await page.goto(options.productUrl, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      console.log("Página cargada correctamente");
    } catch (error) {
      console.error("Error al cargar la página:", error.message);
      await browser.close();
      throw new Error(`Error al acceder a la URL: ${error.message}`);
    }

    // Añadir verificación visual de la página
    console.log("Verificando elementos en la página...");

    // Esperar a que los elementos principales estén disponibles con mejor manejo de errores
    try {
      console.log("Esperando por el título del producto...");
      await page.waitForSelector("span[class*='VU-ZEz']", { timeout: 10000 });

      console.log("Esperando por el precio del producto...");
      await page.waitForSelector("div[class*='Nx9bqj CxhGGd']", {
        timeout: 10000,
      });

      console.log("Esperando por la descripción del producto...");
      await page.waitForSelector("div[class*='yN+eNk w9jEaj']", {
        timeout: 10000,
      });

      console.log("Todos los elementos principales encontrados");
    } catch (error) {
      console.error("Error al esperar por elementos:", error.message);

      // Tomar captura de pantalla para diagnóstico si estamos en modo prueba
      if (options.test) {
        await page.screenshot({ path: "error-screenshot.png" });
        console.log("Se ha guardado una captura de pantalla para diagnóstico");
      }

      await browser.close();
      throw new Error(
        `No se pudieron encontrar los elementos principales: ${error.message}`
      );
    }

    // Extraer información del producto
    console.log("Extrayendo información del producto... ");
    const productData = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "";
      };

      // Extraer especificaciones detalladas
      const getSpecifications = () => {
        const specs = {};
        const specRows = document.querySelectorAll("div[class*='_14cfVK']");
        specRows.forEach((row) => {
          const label = row.querySelector("td[class*='_1hKmbr']");
          const value = row.querySelector("li[class*='_21lJbe']");
          if (label && value) {
            specs[label.textContent.trim()] = value.textContent.trim();
          }
        });
        return specs;
      };

      // Extraer imágenes del producto
      const getProductImages = () => {
        const images = [];
        document.querySelectorAll("img[class*='_0DkuPH']").forEach((img) => {
          if (img.src && !images.includes(img.src)) {
            images.push(img.src);
          }
        });
        return images;
      };

      // Extraer ofertas si existen
      const getOffers = () => {
        const offers = [];
        document.querySelectorAll("div[class*='_2ZdXDB']").forEach((offer) => {
          offers.push(offer.textContent.trim());
        });
        return offers;
      };

      const name = getTextContent("span[class*='VU-ZEz']");
      const priceText = getTextContent("div[class*='Nx9bqj CxhGGd']");
      const description = getTextContent("div[class*='yN+eNk w9jEaj']");

      console.log("Datos extraídos:", { name, priceText, description });

      return {
        name,
        price: parseInt(priceText.replace(/[^0-9]/g, "")),
        description,
        images: getProductImages(),
        /*  rating: getTextContent("div[class*='_3LWZlK']"),
        specifications: getSpecifications(),
        offers: getOffers(),
        images: getProductImages(), */
      };
    });

    console.log("Verificando si el producto ya existe...");
    // Verificar si el producto ya existe
    const existingProduct = await Product.findOne({
      name: productData.name,
      category: options.categoryId,
    }).exec();

    if (existingProduct) {
      console.log("Producto ya existente:", existingProduct.name);
      console.log("Cerrando navegador...");
      await browser.close();
      console.log("Navegador cerrado correctamente");
      return {
        success: false,
        message: "El producto ya existe en la base de datos",
        data: {
          existingProduct: {
            id: existingProduct._id,
            name: existingProduct.name,
          },
        },
      };
    }

    const uploadImagesToFirebase = async (images) => {
      if (!options.test && options.save.images) {
        console.log("Uploading images to Firebase...");
        const uploadedImages = [];

        for (const imageUrl of images) {
          try {
            // Descargar la imagen localmente
            const imageData = await downloadImage(imageUrl);
            //console.log("imageData:", imageData);

            if (!imageData) continue;

            // Leer el archivo local
            const fileBuffer = fs.readFileSync(imageData.filePath);
            const fileData = {
              buffer: fileBuffer,
              mimetype: imageData.mimetype,
              originalname: imageData.originalname,
              size: imageData.size,
            };

            // Subir a Firebase usando la función que ya tienes
            const uploadResult = await uploadFile(fileData, {
              folder: "products",
              maxSize: 5, // 5MB máximo
            });

            if (uploadResult.success) {
              uploadedImages.push({
                url: uploadResult.url,
                fileName: uploadResult.fileName,
              });

              // Eliminar el archivo temporal después de subirlo
              fs.unlinkSync(imageData.filePath);
            }
          } catch (error) {
            fs.unlinkSync(imageData.filePath);
            console.error("Error procesando imagen:", error);
          }
        }

        console.log("Uploaded images:", uploadedImages);
        return uploadedImages;
      } else {
        console.log("Test Mode for upload images");
        const ArrayTest = [
          { fileName: "Image", url: "ImageUrl" },
          { fileName: "Image", url: "ImageUrl" },
        ];
        return ArrayTest;
      }
    };

    // Modificar el processedProduct para incluir las imágenes
    const imageUrls = await uploadImagesToFirebase(productData.images);

    // console.log("Información extraída:", productData);
    console.log("Cerrando navegador...");
    await browser.close();
    console.log("Navegador cerrado correctamente");
    const quantityRandomNumber = Math.floor(Math.random() * 100);

    // Procesar y limpiar los datos extraídos
    const processedProduct = {
      name: productData.name,
      slug: `${slugify(productData.name)}`,
      price: productData.price,
      quantity: quantityRandomNumber, // Cantidad por defecto
      description: productData.description,
      /* offer: productData.offers.length > 0 ? productData.offers[0] : null, */
      productPictures: imageUrls.map((img) => ({
        name: img.fileName,
        imgUrl: img.url,
      })),
      category: options.categoryId,
      /* specifications: productData.specifications,
      rating: parseFloat(productData.rating) || 0, */
      createdBy: "66d5dfd16837ab006fa71f96",
    };

    // Guardar el producto si no estamos en modo prueba
    if (!options.test && options.save.product) {
      console.log("Guardando producto en la base de datos...");
      const product = new Product(processedProduct);
      const savedProduct = await product.save();
      console.log("Producto guardado exitosamente:", savedProduct.name);

      return {
        success: true,
        message: "Producto guardado exitosamente",
        data: {
          product: {
            id: savedProduct._id,
            name: savedProduct.name,
            category: category.name,
          },
        },
      };
    }

    // En modo prueba, solo retornar los datos extraídos
    console.log({
      success: true,
      message: "Datos del producto extraídos exitosamente (modo prueba)",
      data: {
        productData: processedProduct,
      },
    });
    console.log("Operación completada en modo prueba");
    return {
      success: true,
      message: "Datos del producto extraídos exitosamente (modo prueba)",
      data: {
        productData: processedProduct,
        productPictures: processedProduct.productPictures,
      },
    };
  } catch (error) {
    console.error("Error en scraperFlipkartProducts:", error);
    return {
      success: false,
      message: "Error al procesar el producto",
      error: error.message,
    };
  }
};

exports.scraperFlipkartListProducts = async (
  url,
  categoryId,
  options = {
    test: "true",
  }
) => {
  if (!url) throw new Error("Necesita Url de la busqueda del producto");
  if (!categoryId)
    throw new Error(
      "Necesita ID de la categoria a la que perteneceran los productos"
    );

  // Verificar si la categoría existe
  const category = await Category.findById(categoryId).exec();
  if (!category) {
    throw new Error("La categoría especificada no existe");
  }

  const browser = await chromium.launch({
    headless: options.test,
    timeout: 60000, // Aumentar timeout para lanzamiento del navegador
  });

  const page = await browser.newPage();

  await page.setDefaultTimeout(60000);
  await page.setDefaultNavigationTimeout(60000);

  console.log("Accediendo a la URL del producto...");
  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    console.log("Página cargada correctamente");
  } catch (error) {
    console.error("Error al cargar la página:", error.message);
    await browser.close();
    throw new Error(`Error al acceder a la URL: ${error.message}`);
  }

  try {
    console.log("Esperando por el título del producto...");
    await page.waitForSelector("a[class*='CGtC98']", { timeout: 10000 });
    console.log("Todos los elementos principales encontrados");
  } catch (error) {
    console.error("Error al esperar por elementos:", error.message);

    // Tomar captura de pantalla para diagnóstico si estamos en modo prueba
    if (options.test) {
      await page.screenshot({ path: "error-screenshot.png" });
      console.log("Se ha guardado una captura de pantalla para diagnóstico");
    }

    await browser.close();
    throw new Error(
      `No se pudieron encontrar los elementos principales: ${error.message}`
    );
  }

  console.log("Extrayendo información del producto...");
  const productData = await page.evaluate(() => {
    const productsData = [];
    const products = document.querySelectorAll("a[class*='CGtC98']");
    products.forEach((el, index) => {
      if (index < 10) {
        const productUrl = el.href;
        productsData.push({ productUrl });
      }
    });
    return productsData;
  });

  await browser.close();

  if (options.test) {
    console.log("Testeando la data");
    console.log(productData);
  } else {
    const processedProducts = { successProducts: [], errorsProducts: [] };
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (const product of productData) {
      console.log("Scrapeando la pagina de un producto");
      const processedProduct = await this.scraperFlipkartProducts({
        productUrl: product.productUrl,
        categoryId,
        save: { product: true, images: true },
        test: false,
      });
      await delay(1000); // Esperar 1 segundo entre peticiones
      if (processedProduct.success) {
        processedProducts.successProducts.push(processedProduct);
      } else {
        processedProducts.errorsProducts.push(processedProduct);
      }
      console.log("Finalizando el scraper de la pagina de un producto");
    }
  }
};
