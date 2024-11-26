const db = require("../db/connection");

//TASK 3
exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(( { rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No topics found"});
        }
        return rows;
    });
};