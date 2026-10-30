
import { body, param, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

const taskValidator = {
    create: [
        body("title")
            .exists().withMessage("Title is required").bail()
            .trim()
            .notEmpty().withMessage("Title is empty").bail()
            .isString().withMessage("Title is string"),

        body("description")
            .optional()
            .isString().withMessage("Description must be a string"),

        body("dueDate")
            .notEmpty().withMessage("Due date is required").bail()
            .isISO8601().withMessage("Invalid due date"),

        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Priority must be Low, Medium, or High"),

        body("status")
            .optional()
            .isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid task status"),

        validate,
    ],

    update: [
        param("id")
            .isMongoId().withMessage("Invalid task ID"),

        body("title")
            .optional()
            .trim()
            .notEmpty().withMessage("Title cannot be empty"),

        body("description")
            .optional()
            .isString().withMessage("Description must be a string"),

        body("dueDate")
            .optional()
            .isISO8601().withMessage("Invalid due date"),

        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Priority must be Low, Medium, or High"),

        body("status")
            .optional()
            .isIn(["Pending", "In Progress", "Completed"])
            .withMessage("Invalid task status"),

        validate,
    ],

    taskId: [
        param("id")
            .isMongoId().withMessage("Invalid task ID"),
        validate,
    ],
};

export default taskValidator;
