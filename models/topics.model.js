const db = require("../db/connection");

//TASK 3
exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(( { rows }) => {
        return rows;
    });
};

//TASK 22
exports.addTopic = (newTopic) => {
    const { slug, description } = newTopic;
    if (!slug || typeof slug !== "string") {
        return Promise.reject({ status: 400, msg: "Bad request: Invalid or missing slug"});
    }
    const validDescription = typeof description === "string" ? description : null;
    return db.query(`
        INSERT INTO topics (slug, description)
        VALUES ($1, $2) RETURNING *;`, [slug, validDescription])
        .then(({ rows }) => {
            return rows[0];
        })
        .catch((err) => {
            if (err.code === "23505") {
                return Promise.reject({ status: 400, msg: "Bad request: Topic already exists" });
            }
            throw err;
        });
};