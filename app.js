const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/topics.controller");
const { getSingleArticle, getArticles } = require("./controllers/articles.controller");
const { getComments, postComment } = require("./controllers/comments.controller");
//For task 10: Require in users.controller!
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.use(express.json())

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSingleArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/:article_id/comments", postComment);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Endpoint not found' });
})

app.use(handlePostgresErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;