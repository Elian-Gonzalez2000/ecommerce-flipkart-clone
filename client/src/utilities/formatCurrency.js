export default ({ currency = "", value, style = "currency" }) => {
   if (style === "currency") {
      const formatter = new Intl.NumberFormat("en-US", {
         style,
         maximumFractionDigits: 2,
         currency,
      });
      return formatter.format(value);
   }

   const formatter = new Intl.NumberFormat("en-US", {
      style,
      maximumFractionDigits: 2,
   });
   return formatter.format(value);
};
