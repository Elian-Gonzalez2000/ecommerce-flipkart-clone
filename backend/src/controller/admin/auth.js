const User = require("../../models/auth.js");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { getTokenData, getToken } = require("../../config/jwt.config.js");
const { getTemplate, sendEmail } = require("../../config/mail.config.js");

env.config();

// exports something with specific name
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already registered",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      role: "admin",
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong ",
          error: error,
        });
      }

      if (data) {
        let expireTimeToken = "1h";
        const token = getToken(
          { email: data.email, _id: data._id },
          `${expireTimeToken}`
        );
        const template = getTemplate(data.email, token);
        sendEmail(
          data.email,
          "Confirmation instructions to your Flipkart account",
          template
        );
        return res.status(201).json({
          message: "Admin created  successfuly but need to confirm it",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "admin") {
        // Create a token with JsonWebToken, expires in 2 hours
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "2d",
          }
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "2d" });
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wront" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout succefully... !",
  });
};

exports.confirm = async (req, res) => {
  const { token, adminEmail } = req.params;

  const data = getTokenData(token);

  if (data === null || data?.error) {
    User.deleteOne({ email: adminEmail }).exec((error, result) => {
      if (result)
        return res.redirect(
          `http://localhost:3000/signup/admin/error/${data?.error}`
        );
    });
  }
  if (data?.data) {
    const { email, _id } = data.data;

    User.findOne({ email }).exec((error, user) => {
      if (!user) return res.status(400).json({ error });
      console.log(_id, user._id.toString());

      user.status = "VERIFIED";
      user.save((error, result) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong ",
            error: error,
          });
        }

        if (result) {
          return res.redirect("http://localhost:3000/signup/admin/confirm");
        }
      });
    });
  }
  /* try {
    // Obtener el token
    const { token } = req.params;

    // Verificar la data
    const data = await getTokenData(token);

    if (data === null) {
      return res.json({
        success: false,
        msg: "Error al obtener data",
      });
    }

    console.log(data);

    const { email, code } = data.data;

    // Verificar existencia del usuario
    const user = (await User.findOne({ email })) || null;

    if (user === null) {
      return res.json({
        success: false,
        msg: "User dont exist",
      });
    }

    // Verificar el código
    if (code !== user.code) {
      return res.redirect("/error.html");
    }

    // Actualizar usuario
    user.status = "VERIFIED";
    await user.save();

    // Redireccionar a la confirmación
    return res.redirect("/confirm.html");
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "Error al confirmar usuario",
    });
  } */
};
