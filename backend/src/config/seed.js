const { chromium } = require("playwright");

exports.scraper = async () => {
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
  await page.getByText("Electronics", { exact: true }).hover();

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
      const selector = el.innerText;
      const categories = Array.from($categories).map((child) =>
        child.innerText.trim()
      );
      const subCategories = Array.from($subCategories).map((child) =>
        child.innerText.trim()
      );
      const childrenSubCategoriesDirty = Array.from($childrenSubCategories).map(
        (child) =>
          !child.classList.contains("cNDIdi") ? child.innerText.trim() : ""
      );
      const childrenSubCategories = childrenSubCategoriesDirty.filter(
        (child) => child !== ""
      );
      return { categories, subCategories, childrenSubCategories };
    });
  });

  await browser.close();
  return await categories[0];
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
