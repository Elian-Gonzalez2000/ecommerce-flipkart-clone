const User = require("../../models/auth.js");
const jwt = require("jsonwebtoken");

// exports something with specific name
exports.signup = (req, res) => {
   User.findOne({ email: req.body.email }).exec((error, user) => {
      if (user)
         return res.status(400).json({
            message: "Admin already registered",
         });

      const { firstName, lastName, email, password } = req.body;
      const _user = new User({
         firstName,
         lastName,
         email,
         password,
         username: Math.random().toString(),
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
            return res.status(201).json({
               message: "Admin created  successfuly",
            });
         }
      });
   });
};

exports.signin = (req, res) => {
   User.findOne({ email: req.body.email }).exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
         if (user.authenticate(req.body.password) && user.role === "admin") {
            // Create a token with JsonWebToken, expires in 2 hours
            const token = jwt.sign(
               { _id: user._id, role: user.role },
               process.env.JWT_SECRET,
               {
                  expiresIn: "2h",
               }
            );
            const { _id, firstName, lastName, email, role, fullName } = user;
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
