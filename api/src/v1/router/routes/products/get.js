const express = require("express");
const checkAuth = require("../../../authorization/checkAuth");
const Permissions = require("../../../authorization/Permissions");
const router = express.Router();
const ProductsManager = require("./ProductsManager");

router.get("/products", checkAuth(Permissions.READ_PRODUCTS), async (req, res, next) => {
    try {
        const _offset = Number.parseInt(req.query.offset) || 0;
        const _limit = Number.parseInt(req.query.limit) || 100;

        if (!Number.isInteger(_offset) || _offset < 0) {
            return res.status(400).json({ message: "Query offset must be a number greater than 0", code: 400 });
        }

        if (!Number.isInteger(_limit) || _limit < 5 || _limit > 100) {
            return res.status(400).json({ message: "Query limit must be a number between 5 and 100", code: 400 });
        }

        const response = await ProductsManager.getProducts({ offset: _offset, limit: _limit });

        res.status(200).json(response);
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

router.get("/products/:id", checkAuth(Permissions.READ_PRODUCTS), async (req, res, next) => {
    try {
        const _id = Number.parseInt(req.params.id) || 0;

        if (!Number.isInteger(_id)) {
            return res.status(400).json({ message: "Product id must be a number", code: 400 });
        }

        const response = await ProductsManager.getProduct(_id);

        if (response == null) {
            return res.status(404).json({ message: "Product not found", code: 404 });
        }

        res.status(200).json(response);
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

module.exports = router;