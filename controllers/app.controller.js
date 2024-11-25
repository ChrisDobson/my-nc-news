const endpointsJson = require("../endpoints.json");
const { selectTopics, selectArticles } = require("../models/app.model");

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

//STILL NEED TO DO TASK 4!

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};