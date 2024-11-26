const db = require("../db/connection");

//TASK 6
exports.selectComments = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No comments found"});
        }
        return rows;
    });
};

//TASK 7
exports.addComment = (newComment) => {
    const {/*PROPERTIES OF COMMENT*/} = newComment;
    return db.query(`INSERT VALUES INTO SNACKS, THEN RETURN *;`,
    /*[PROVIDE THE VALUES AS AN ARRAY, TO PREVENT SQL INJECTION]*/)
    .then(({ rows }) => {
        return rows;
    });
};