const express = require("express");
const router = express.Router();

async function init() {
    const endpoints = [
        require("./routes/demands/DemandsManager"),
        require("./routes/products/ProductsManager")
    ];

    for (let endpoint of endpoints) {
        await endpoint.init();
        router.use(endpoint.router);
    }
}

module.exports = { init, router };