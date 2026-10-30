import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRouter from '../routers/authRouter.js';
import taskRouter from '../routers/taskRouter.js';



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173", "https://taskflow-webiste.vercel.app"], credentials: true }));

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("server is runing successfully")
});


app.use('/api/auth', authRouter);

app.use("/api/tasks", taskRouter);


export default app;