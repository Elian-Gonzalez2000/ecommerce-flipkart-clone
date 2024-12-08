const ENVIRONMENT = "develop";
export const api =
  ENVIRONMENT === "developer"
    ? "http://localhost:3002/api"
    : "https://flipkart-rest-server-jvxd.onrender.com/api";
export const genericPublicUrl = (fileName) => {
  return `http://localhost:3002/public/${fileName}`;
};
