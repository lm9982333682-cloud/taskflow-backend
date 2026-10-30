import { body, validationResult, } from "express-validator";

const register = [
    body("name")
        .exists().withMessage("Name is required").bail()
        .trim()
        .notEmpty().withMessage("Name is empty").bail()
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters").bail(),

    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .notEmpty().withMessage("Email is empty").bail()
        .isEmail().withMessage("Please enter a valid email address").bail()
        .normalizeEmail(),

    body("password")
        .exists().withMessage("Password is required").bail()
        .trim()
        .notEmpty().withMessage("Password is empty").bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters").bail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        next();
    }
];

const login = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        next();
    }
];


export default {
    register, login,
}