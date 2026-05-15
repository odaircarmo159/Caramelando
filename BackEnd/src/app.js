const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;