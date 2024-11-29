const db = require("../db/connection");

//TASK 6
exports.selectComments = (article_id, limit = 10, p = 1) => {
    if (isNaN(limit) || limit <= 0 || isNaN(p) || p<= 0) {
        return Promise.reject({ status: 400, msg: "Invalid pagination parameters"});
    }
    const offset = (p - 1) * limit;
    const queryValues = [article_id, limit, offset]
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
    return db.query(queryStr, queryValues)
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No comments found"});
        }
        return rows;
    });
};

//TASK 7
exports.addComment = (article_id, newComment) => {
    const { username, body } = newComment;
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Bad request: Missing required fields"});
    }
    return db.query(`
        INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3) RETURNING *;`, [username, body, article_id]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found"});
        }
        return rows[0];
    });
};

//TASK 9
exports.removeComment = (comment_id) => {
    return db.query(`
        DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found" });
            }
        });
};

//TASK 18
exports.updateComment = (comment_id, inc_votes) => {
    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`, [inc_votes, comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found" });
            }
            return rows[0];
        });
};