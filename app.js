const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/topics.controller");
const { getSingleArticle, getArticles, patchArticle } = require("./controllers/articles.controller");
const { getComments, postComment, deleteComment } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.use(express.json())

app.get("/api", getApi); //TASK 2
app.get("/api/topics", getTopics); //TASK 3
app.get("/api/articles/:article_id", getSingleArticle); //TASKS 4, 13
app.get("/api/articles", getArticles); //TASKS 5, 11, 12
app.get("/api/articles/:article_id/comments", getComments); //TASK 6
app.get("/api/users", getUsers); //TASK 10

app.post("/api/articles/:article_id/comments", postComment); //TASK 7

app.patch("/api/articles/:article_id", patchArticle); //TASK 8

app.delete("/api/comments/:comment_id", deleteComment); //TASK 9

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Endpoint not found' });
})

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;