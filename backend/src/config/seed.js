const { chromium } = require("playwright");
const Category = require("../models/category.js");
const slugify = require("slugify");
const shortid = require("shortid");
const { get } = require("mongoose");

const addSubCategories = async (
  subCategories,
  fatherCategorie,
  options = { test: false }
) => {
  if (!subCategories) return "Need subCategories Array";
  if (!fatherCategorie) return console.log("Need a expecific fatherCategorie");
  const fatherCategorieFound = await Category.findOne({
    name: fatherCategorie,
  });
  if (!fatherCategorieFound) return console.log("Father Categorie not found");
  console.log("Father Categorie Found: ", fatherCategorieFound);
  const fatherCategorieId = fatherCategorieFound._id;
  const getSubCategories = await Category.find({ parentId: fatherCategorieId });
  console.log("Get Sub Categories: ", getSubCategories);

  subCategories.forEach((categorie) => {
    const subCategorieRepeated =
      getSubCategories &&
      getSubCategories.find((subCategorie) => subCategorie.name === categorie);
    const categoryObj = {
      name: categorie,
      slug: `${slugify(categorie)}-${shortid.generate()}`,
      parentId: fatherCategorieId,
    };

    /* if (req.file) {
      categoryObj.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    } */
    if (options.test) {
      console.log("Repeated Categorie? ", subCategorieRepeated && "Yes");

      console.log("Category: ", categoryObj);
      console.log("Testing data...");
      return;
    }
    if (!subCategorieRepeated) {
      const cat = new Category(categoryObj);
      cat.save((error, category) => {
        if (error) console.log(error);

        if (category) {
          console.log(category);
        }
      });
    }
    // console.log("Categories", categorie);
  });
};

const addChildrenSubCategories = async (
  childrenSubCategories,
  options = { test: false }
) => {
  let subCategorieId = "";
  for (let i = 0; i < childrenSubCategories.length; i++) {
    if (childrenSubCategories[i]?.subCategorieClass) {
      const getSubCategorie = await Category.findOne({
        name: childrenSubCategories[i].innerText.trim(),
      });
      if (!getSubCategorie) return console.log("Sub Categorie not found");
      if (getSubCategorie) {
        subCategorieId = getSubCategorie._id;
      }
    } else {
      const getChildrenSubCategorie = await Category.findOne({
        name: childrenSubCategories[i].innerText.trim(),
      });
      const categoryObj = {
        name: childrenSubCategories[i].innerText.trim(),
        slug: `${slugify(
          childrenSubCategories[i].innerText.trim()
        )}-${shortid.generate()}`,
        parentId: subCategorieId,
      };
      if (options.test) {
        console.log("Category: ", categoryObj);
        console.log("GetChildrenCategorie: ", getChildrenSubCategorie);
        return;
      }
      if (getChildrenSubCategorie?.name != categoryObj.name) {
        const cat = new Category(categoryObj);
        cat.save((error, category) => {
          if (error) return console.log(error);
          if (category) {
            return console.log(category);
          }
        });
      }
    }
  }
};

exports.scraper = async (targetedCategorie) => {
  console.log("Scraping Flipkart...");

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

  addChildrenSubCategories(childrenSubCategories, { test: false });
  addSubCategories(subCategories, targetedCategorie, { test: false });

  /*   categories[0].subCategories.forEach((categorie) => {
    const categoryObj = {
      name: categorie,
      slug: `${slugify(categorie)}-${shortid.generate()}`,
      parentId: "67d88cc98800aa80cbb0250f",
    };

    if (req.file) {
      categoryObj.categoryImage =
         process.env.API + "/public/" + req.file.filename;
   }

    const cat = new Category(categoryObj);
    cat.save((error, category) => {
      if (error) return console.log(error);

      if (category) {
        return console.log(category);
      }
    });
    console.log("Categories", categorie);
  }); */
  /* addChildrenSubCategories(categories[0].childrenSubCategories);
  console.log("Categories", categories); */
};

/* exports.scraper = async () => {
  console.log("Scraping Flipkart...");

  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage();
  // Class: CGtC98
  // Class Name product: KzDlHZ
  // Class Price product: Nx9bqj
  // Class image product: DByuf4
  // Class Category Father category: TSD49J
  // Class Category second category: jBYtJt cNDIdi
  // Class Category children category: jBYtJt
  // Class Category Menu: bpjkJb
  // Class Category father: nEqBzi
  // Class Category father: jzpKY6
  const searchQuery = "samsung mobile";
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(
    searchQuery
  )}`;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Espera que los productos carguen
  await page.waitForSelector(".bpjkJb");

  await page.evaluate(() => {
    const menuTrigger = document.querySelector(".TSD49J");
    if (menuTrigger) {
      menuTrigger.dispatchEvent(new Event("mouseover", { bubbles: true }));
    }
  });

  console.log("Page loaded", url);
  console.log("Page loaded", await page.title());

  const products = await page.$$eval(".TSD49J", (items) => {
    return items.map(async (item) => {
      await item.waitForEvent("mouseover");
      const categories = Array.from(item.querySelectorAll(".TSD49J")).map(
        (category) => {
          category.waitForEvent("mouseover");
        }
      );
      return await { item: item.innerText };
    });
  });

  console.log("Products", products);

  await browser.close();
};
 */
