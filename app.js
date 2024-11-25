const express = require("express");
const app = express();
const { getApi, getTopics, getSingleArticle, getArticles } = require("./controllers/app.controller");
const { handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSingleArticle);
app.get("/api/articles", getArticles);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;