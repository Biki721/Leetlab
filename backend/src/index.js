import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
