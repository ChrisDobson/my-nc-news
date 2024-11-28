const db = require("../db/connection");

//TASK 10
exports.selectUsers = () => {
    return db.query("SELECT * FROM users;")
    .then(( { rows }) => {
        return rows;
    });
};

//TASK 17
exports.selectSingleUser = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Username not found"});
        }
        return rows[0];
    });
}