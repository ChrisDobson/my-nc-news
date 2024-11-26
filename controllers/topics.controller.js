const endpointsJson = require("../endpoints.json");
const { selectTopics } = require("../models/topics.model");

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