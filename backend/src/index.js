import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

//TODO: CORS Options
const corsOptions = {};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



const port = process.env.PORT || 8000;

app.get("/health", (req, res) => {
  res.send("Server is up and running");
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
