export const sortPriceLowToHigh = (data) => {
  if (!Array.isArray(data))
    return console.error("Necesita un array de productos");

  return [...data].sort((a, b) => a.price - b.price);
};

export const sortPriceHighToLow = (data) => {
  if (!Array.isArray(data))
    return console.error("Necesita un array de productos");

  return [...data].sort((a, b) => b.price - a.price);
};

export const sortNewestFirst = (data) => {
  if (!Array.isArray(data))
    return console.error("Necesita un array de productos");

  return [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};
