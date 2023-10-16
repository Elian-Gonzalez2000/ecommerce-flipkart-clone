const { check, validationResult } = require("express-validator");

// Validations for signup form
exports.validateSignupRequest = [
   check("firstName").isEmpty().withMessage("firstName is required"),
   check("lastName").isEmpty().withMessage("lastName is required"),
   check("email").isEmail().withMessage("Valid Email is required"),
   check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character long"),
];

// Validations for signin form
exports.validateSigninRequest = [
   check("email").isEmail().withMessage("Valid Email is required"),
   check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
   const errors = validationResult(req.body);

   if (errors.array().length > 0) {
      return res.status(400).json({ error: errors.array()[0].msg });
   }
   next();
};
