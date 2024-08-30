const jwt = require("jsonwebtoken");

const getToken = (payload, expiresTime = "1h") => {
  return jwt.sign(
    {
      data: payload,
    },
    "SECRET",
    { expiresIn: expiresTime }
  );
};

const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, "SECRET", (err, decoded) => {
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
