const endpointsJson = require("../endpoints.json");
const { selectTopics, selectSingleArticle, selectArticles, selectComments } = require("../models/app.model");

//TASK 2
exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
}

//TASK 3
exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next);
}

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
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};


//TASK 6
exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    selectComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};