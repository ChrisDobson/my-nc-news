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

//TASK 4
exports.selectSingleArticle = (article_id) => {
    const text = `SELECT * FROM articles WHERE article_id = $1;`
    const values = [article_id];
    return db.query(text, values).then(({ rows }) => {
        return rows[0]});
    };

//TASK 5
exports.selectArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(( { rows }) => {
            return rows.map((article) => ({
                ...article,
                comment_count: Number(article.comment_count),
            }));
        });
};

//TASK 6
exports.selectComments = (article_id) => {
    const text = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`
    const values = [article_id];
    return db.query(text, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "No comments found"});
        }
        return rows;
    });
};

//TASK 7