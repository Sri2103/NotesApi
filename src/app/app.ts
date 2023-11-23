import express from "express";
import cors from "cors";
import { handleError } from "../middleware/errorHandler";
import api from "../routes";
import morgan from "morgan";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.send({ message: "I'm alive" });
});
// Routes
app.use("/api", api);

app.use(handleError);

export default app;
