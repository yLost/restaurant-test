const app = require("express")();
const DatabaseManager = require("./src/database/databaseManager");
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Cookie");
    res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PATCH");

    if (req.method == "OPTIONS") {
        return res.status(204).header("Allow", "OPTIONS, POST, GET, PATCH").send();
    }

    next();
});

const RouterManager = require("./src/v1/router/RouterManager");
app.use("/api/v1", RouterManager.router);

async function init() {
    await DatabaseManager.init();
    await RouterManager.init();
}

module.exports = { app, init };