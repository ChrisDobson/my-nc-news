exports.handleCustomErrors = (req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error "});
};