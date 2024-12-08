const ENVIRONMENT = "developer";
export const api =
  ENVIRONMENT === "developer"
    ? "http://localhost:3002/api"
    : "https://flipkart-rest-server-jvxd.onrender.com/api";
export const genericPublicUrl = (fileName) => {
  return `http://localhost:3002/public/${fileName}`;
};

export const PUBLIC_KEY_STRIPE =
  "pk_test_51Q05PVP1aLj7viF3jbKeLMZKe7d2YMHXASFL5NNVFvHROPHRLO5vbNN446jb8887OTmn2AWjX1gZNKi4505xzAVR00Qsz6bycP";
