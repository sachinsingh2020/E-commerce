import express from 'express';
import UserRoute from "./routes/user.js";
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Server is Working");
});
const port = process.env.PORT || 4000;
connectDB();
app.use("/api/v1/user", UserRoute);
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
