
import { Router } from "express";
import taskController from "../controllers/taskController.js";
import taskValidator from "../validator/taskValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = Router();

taskRouter.use(authMiddleware);


taskRouter.post("/", taskValidator.create, taskController.createTask);
taskRouter.get("/", taskController.getTasks);
taskRouter.get("/:id", taskValidator.taskId, taskController.getTaskById);
taskRouter.put("/:id", taskValidator.update, taskController.updateTask);
taskRouter.delete("/:id", taskValidator.taskId, taskController.deleteTask);

export default taskRouter;
