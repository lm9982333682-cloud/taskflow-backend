
import Task from "../models/taskModel.js";

// CREATE TASK
const createTask = async (req, res, next) => {

    try {
        const { title, description, dueDate, priority, status } = req.body;

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};



// READ ALL TASKS
const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        next(error);
    }
};

// READ SINGLE TASK
const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE TASK
const updateTask = async (req, res, next) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "dueDate",
            "priority",
            "status",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE TASK
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};

export default {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
