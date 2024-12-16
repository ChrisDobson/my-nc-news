const express = require("express");
const app = express();
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controller");
const apiRouter = require("./routes/api-router");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Endpoint not found' });
})

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;