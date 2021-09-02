const express = require("express");
const checkAuth = require("../../../authorization/checkAuth");
const Permissions = require("../../../authorization/Permissions");
const router = express.Router();
const DemandsManager = require("./DemandsManager");

router.get("/demands", checkAuth(Permissions.READ_DEMANDS), async (req, res, next) => {
    try {
        const response = await DemandsManager.getDemands();

        res.status(200).json(response);
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

router.get("/demands/:id", checkAuth(Permissions.READ_DEMANDS), async (req, res, next) => {
    try {
        const _id = Number.parseInt(req.params.id) || 0;

        if (!Number.isInteger(_id)) {
            return res.status(400).json({ message: "Demand id must be a number", code: 400 });
        }

        const response = await DemandsManager.getDemand(_id);

        if (response == null) {
            return res.status(404).json({ message: "Demand not found", code: 404 });
        }

        res.status(200).json(response);
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

module.exports = router;