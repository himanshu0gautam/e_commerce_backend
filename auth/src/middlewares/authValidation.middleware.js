const {validationResult,body} = require('express-validator')
const isValidationMessage = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next(); // no errors, continue to next middleware
    }
    return res.status(400).json({ errors: result.array() });
};

const registerUserValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email'),

    body('name')
        .isString()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body('password')
        .isStrongPassword()
        .withMessage("Password must be strong and at least 6 characters"),

    body('street')
        .isString()
        .withMessage("Street is required"),

    body('city')
        .isString()
        .withMessage("City is required"),

    body('state')
        .isString()
        .withMessage("State is required"),

    body('zip')
        .isPostalCode("any")
        .withMessage("Invalid postal code"),

    body('country')
        .isString()
        .withMessage("Country is required"),
        isValidationMessage

];

const loginValidation = [
  body("username")
    .optional() // make username optional
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),

  body("email")
    .optional() // make email optional
    .isEmail()
    .withMessage("Invalid email"),

  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error("Either username or email is required");
    }
    return true;
  }),

  body("password")
    .isStrongPassword()
    .withMessage("Password must be strong"),
  isValidationMessage,
];

module.exports = {registerUserValidator,loginValidation}

