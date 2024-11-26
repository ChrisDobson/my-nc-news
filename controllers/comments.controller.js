const { selectComments, addComment, removeComment } = require("../models/comments.model");

//TASK 6
exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    selectComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};

//TASK 7
exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    addComment(article_id, newComment)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next);
};

//TASK 9
exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
};