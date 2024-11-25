const endpointsJson = require("../endpoints.json");
const { selectTopics, selectSingleArticle, selectArticles } = require("../models/app.model");

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
}

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next);
}

exports.getSingleArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectSingleArticle(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};