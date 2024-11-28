const usersRouter = require("express").Router();
const { getUsers, getSingleUser } = require("../controllers/users.controller");

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getSingleUser);

module.exports = usersRouter;