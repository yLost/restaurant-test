const express = require("express");
const checkAuth = require("../../../authorization/checkAuth");
const Permissions = require("../../../authorization/Permissions");
const router = express.Router();
const DemandsManager = require("./DemandsManager");

router.patch("/demands/:id", checkAuth(Permissions.UPDATE_DEMANDS), async (req, res, next) => {
    try {
        const _id = Number.parseInt(req.params.id) || 0;

        if (!Number.isInteger(_id)) {
            return res.status(400).json({ message: "Demand id must be a number", code: 400 });
        }

        const responseDemand = await DemandsManager.getDemand(_id);

        if (responseDemand == null) {
            return res.status(404).json({ message: "Demand not found", code: 404 });
        }

        const response = await DemandsManager.updateDemand(id, req.body);

        if (response != true) {
            return res.status(202).json({ message: "Demand cannot be updated", code: 202 });
        }

        res.status(200).json({ message: "Success", code: 200 });
    } catch (exc) {
        console.log(exc);
        res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
});

module.exports = router;