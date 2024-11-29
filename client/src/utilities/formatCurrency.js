export default ({ currency = "", value, style = "currency" }, options = {}) => {
  if (style === "currency") {
    const formatter = new Intl.NumberFormat("en-US", {
      style,
      //  maximumFractionDigits: 2,
      currency,
      ...options,
    });
    return formatter.format(value);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};
