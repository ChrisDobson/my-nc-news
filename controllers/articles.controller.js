const { selectSingleArticle, selectArticles, updateArticle } = require("../models/articles.model");

//TASK 4
exports.getSingleArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectSingleArticle(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};

//TASK 5
exports.getArticles = (req, res, next) => {
    const { sort_by = 'created_at', order = 'desc' } = req.query
    selectArticles(sort_by, order)
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};

//TASK 8
exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } =req.body;
    updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};