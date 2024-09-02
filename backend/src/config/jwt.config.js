const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();
const getToken = (payload, expiresTime = "1h") => {
  return jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiresTime }
  );
};

const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error al obtener data del token");
    } else {
      data = decoded;
    }
  });

  return data;
};

module.exports = {
  getToken,
  getTokenData,
};
