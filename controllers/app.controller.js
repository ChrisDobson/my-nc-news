const endpointsJson = require("../endpoints.json");
const { selectTopics } = require("../models/app.model");

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