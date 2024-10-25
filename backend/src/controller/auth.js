const User = require("../models/auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { getToken, getTokenData } = require("../config/jwt.config.js");
const { getTemplateUser, sendEmail } = require("../config/mail.config.js");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// exports something with specific name
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email, role: "user" }).exec(
    async (error, user) => {
      if (user)
        return res.status(400).json({
          error: "User already registered",
        });

      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
      });

      _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
            error,
          });
        }

        if (user) {
          let expireTimeToken = 1000 * 60;
          const { _id, firstName, lastName, email, role, fullName } = user;
          const token = getToken(
            { email: email, _id: _id },
            `${expireTimeToken}`
          );
          const template = getTemplateUser(email, token, email);
          sendEmail(
            email,
            "Confirmation instructions to your Flipkart account",
            template
          );
          return res.status(201).json({
            message: "User created  successfuly but need to confirm it",
            token,
            user: { _id, firstName, lastName, email, role, fullName },
          });
        }
      });
    }
  );
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // Create a token with JsonWebToken, expires in 1d hours
        // const token = jwt.sign(
        //    { _id: user._id, role: user.role },
        //    process.env.JWT_SECRET,
        //    {
        //       expiresIn: "2d",
        //    }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wront" });
    }
  });
};

exports.confirm = async (req, res) => {
  const { token, userEmail } = req.params;

  const data = getTokenData(token);

  if (data === null || data?.error) {
    User.deleteOne({ email: userEmail }).exec((error, result) => {
      if (result)
        return res.redirect(
          `http://localhost:2000/signup/user/error/${data?.error}`
        );
    });
  }
  if (data?.data) {
    const { email, _id } = data.data;

    User.findOne({ email }).exec((error, user) => {
      if (!user) return res.status(400).json({ error });
      console.log(_id, user._id.toString());
      if (user._id.toString() !== _id)
        return res.redirect("http://localhost:2000/signup/user/error");

      user.status = "VERIFIED";
      user.save((error, result) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong ",
            error: error,
          });
        }

        if (result) {
          return res.redirect("http://localhost:2000/signup/user/success");
        }
      });
    });
  }
};
