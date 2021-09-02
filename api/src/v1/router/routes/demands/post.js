const express = require("express");
const checkAuth = require("../../../authorization/checkAuth");
const Permissions = require("../../../authorization/Permissions");
const router = express.Router();
const DemandsManager = require("./DemandsManager");

router.post("/demands", checkAuth(Permissions.CREATE_DEMANDS), async (req, res, next) => {
    try {
        const table = Number.parseInt(req.body.table) || 0;

        if (!Number.isInteger(table) || table <= 0) {
            return res.status(400).json({ message: "Table must be a number greater than 0", code: 400 });
        }

        const response = await DemandsManager.createDemand(table);

        if (response == null) {
            return res.status(202).json({ message: "Demand cannot be created, table already in use?", code: 202 });
        }

        res.status(200).json({ id: response });
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

module.exports = router;