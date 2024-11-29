const { selectArticles, addArticle, selectSingleArticle, updateArticle, removeArticle } = require("../models/articles.model");

//TASKS 5, 11, 12, 20
exports.getArticles = (req, res, next) => {
    const { sort_by = 'created_at', order = 'desc', topic, limit = 10, p = 1 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(p, 10);
    selectArticles(sort_by, order, topic, parsedLimit, parsedPage)
    .then(({ articles, total_count }) => {
        res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

//TASK 19
exports.postArticle = (req, res, next) => {
    const newArticle = req.body;
    addArticle(newArticle)
    .then((article) => {
        res.status(201).send({ article });
    })
    .catch(next);
};

//TASKS 4, 13
exports.getSingleArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectSingleArticle(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};

//TASK 8
exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

//TASK 23
exports.deleteArticle = (req, res, next) => {
    const { article_id } = req.params;
    removeArticle(article_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
};