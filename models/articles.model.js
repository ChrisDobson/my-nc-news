const db = require("../db/connection");

//TASKS 5, 11, 12, 20
exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic, limit = 10, p = 1) => {
    const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
    const validOrders = ['asc', 'desc'];
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by column"});
    }
    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order value"});
    }
    if (isNaN(limit) || limit <= 0 || isNaN(p) || p <= 0) {
        return Promise.reject({ status: 400, msg: "Invalid pagination parameters" });
    }
    const queryValues = [];
    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
    if (topic) {
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic);
    }
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
    const offset = (p -1) * limit;
    queryStr += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2};`;
    queryValues.push(limit, offset);
    
    const countQueryStr = `SELECT COUNT(*) AS total_count FROM articles ${topic ? `WHERE topic = $1` : ''}`;
        return Promise.all([
            db.query(queryStr, queryValues),
            db.query(countQueryStr, topic ? [topic] : [])
        ]).then(([articlesResult, countResult]) => {
            const { rows: articles } = articlesResult;
            const { rows: countRows } = countResult;
            if (articles.length === 0 && topic) {
                return Promise.reject({ status: 404, msg: "Topic not found" });
            }
            return {
                articles, total_count: Number(countRows[0].total_count),
            };
        });
};

//TASK 18
exports.addArticle = (newArticle) => {
    const { author, title, body, topic, article_img_url } = newArticle;
    const defaultUrl = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
    if (!author || !title || !body || !topic) {
        return Promise.reject({ status: 400, msg: "Bad request: Missing required fields"});
    }
    const imageUrl = typeof article_img_url === "string" && article_img_url.trim() !== "" ? article_img_url : defaultUrl;
    return db.query(`
        INSERT INTO articles (author, title, body, topic, article_img_url, votes)
        VALUES ($1, $2, $3, $4, $5, 0) RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;`,
        [author, title, body, topic, imageUrl])
        .then(({ rows }) => {
            return {
                ...rows[0],
                comment_count: 0,
            };
        });
    };

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

//TASK 23
exports.removeArticle = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad request: Invalid input" });
    }
    return db.query("BEGIN;")
    .then(() => {
        return db.query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
    })
    .then(() => {
        return db.query(`
            DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [article_id])
    })
    .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
        })
        .then(() => db.query("COMMIT;"))
        .catch((err) => {
            return db.query("ROLLBACK;")
            .then(() => Promise.reject(err));
        });
};