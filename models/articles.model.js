const db = require("../db/connection");

//TASK 4
exports.selectSingleArticle = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID not found" });
        }
        return rows[0]
    });
};

//TASK 5
exports.selectArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(( { rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No articles found" });
            }
            return rows.map((article) => ({
                ...article,
                comment_count: Number(article.comment_count),
            }));
        });
};

//TASK 8
exports.updateArticle = (article_id, inc_votes) => {
    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return rows[0];
        });
};