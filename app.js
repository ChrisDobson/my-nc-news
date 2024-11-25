const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/app.controller");
const { handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;