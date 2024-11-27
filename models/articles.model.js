const db = require("../db/connection");

//TASK 4, 13
exports.selectSingleArticle = (article_id) => {
    return db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID not found" });
        }
        return {
            ...rows[0], comment_count: Number(rows[0].comment_count)
        };
    });
};

//TASKS 5, 11, 12
exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const validColumns = ['author', 'title', 'article_id', 'created_at', 'votes'];
    const validOrders = ['asc', 'desc'];
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by column"});
    }
    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order value"});
    }
    const queryValues = [];
    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
    if (topic) {
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic);
    }
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
        return db.query(queryStr, queryValues)
        .then(( { rows }) => {
            if (rows.length === 0 && topic) {
                return Promise.reject({ status: 404, msg: "Topic not found" });
            }
            return rows
            .map((article) => ({
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