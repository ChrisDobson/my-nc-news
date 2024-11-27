const db = require("../db/connection");

//TASK 3
exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(( { rows }) => {
        return rows;
    });
};