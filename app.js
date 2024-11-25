const express = require("express");
const app = express();
const { getApi, getTopics, getArticles } = require("./controllers/app.controller");
const { handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
//STILL NEED TO DO TASK 4!
app.get("/api/articles", getArticles);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;