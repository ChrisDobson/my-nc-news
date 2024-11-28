const { selectUsers, selectSingleUser } = require("../models/users.model");

//TASK 10
exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
};

//TASK 17
exports.getSingleUser = (req, res, next) => {
    const { username } = req.params;
    selectSingleUser(username)
    .then((user) => {
        res.status(200).send({ user });
    })
    .catch(next);
};