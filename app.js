const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/topics.controller");
const { getSingleArticle, getArticles, patchArticle } = require("./controllers/articles.controller");
const { getComments, postComment, deleteComment } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");

app.use(express.json())

//TASKS 2-6, 10-13
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSingleArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/users", getUsers);
//TASK 7
app.post("/api/articles/:article_id/comments", postComment);
//TASK 8
app.patch("/api/articles/:article_id", patchArticle);
//TASK 9
app.delete("/api/comments/:comment_id", deleteComment);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Endpoint not found' });
})

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;