const db = require("../db/connection");

//TASK 10
exports.selectUsers = () => {
    return db.query("SELECT * FROM users;")
    .then(( { rows }) => {
        return rows;
    });
};