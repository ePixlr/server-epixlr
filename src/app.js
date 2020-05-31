const express = require("express");
const cors = require("cors");
const app = express();
const restRouter = require("./api");

app.use(cors());

app.use(express.json());

app.use("/api", restRouter);

module.exports = app;
