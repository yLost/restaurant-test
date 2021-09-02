const express = require("express");
const router = express.Router();
const { execute } = require("../../../../database/databaseManager");
const { Demand, DemandResponse } = require("./structures/index");

/**
 * @returns {Promise<void>}
 */
async function init() {
    await execute("CREATE SEQUENCE IF NOT EXISTS demand_ids;");
    await execute("CREATE TABLE IF NOT EXISTS demand (id INT PRIMARY KEY, table_pos INT DEFAULT 0, demands TEXT DEFAULT '[]', status INT DEFAULT 0);");

    router.use(require("./get"));
    router.use(require("./post"));
}

/**
 * @returns {Promise<DemandResponse>}
 */
async function getDemands() {
    const response = await execute("SELECT * FROM demand;");

    if (response.rows.length > 0) {

        let i = 0;
        let _demands = [];
        while (i < response.rows.length) {
            const row = response.rows[i];
            i++;

            _demands.push(new Demand(row.id, row.table_pos, JSON.parse(row.demands), row.status));
        }

        return new DemandResponse(_demands);
    }

    return new DemandResponse([]);
}

/**
 * 
 * @param {Number} id
 * @returns {Promise<Demand|null>} 
 */
async function getDemand(id) {
    const response = await execute("SELECT * FROM demand WHERE id = $1;", [id]);

    if (response.rows.length > 0) {
        const row = response.rows[0];
        return new Demand(row.id, row.table_pos, JSON.parse(row.demands), row.status);
    }

    return null;
}

/**
 * 
 * @param {Number} table 
 * @returns {Promise<Number>}
 */
async function createDemand(table) {
    const response = await execute("SELECT * FROM demand WHERE status != 3 AND table_pos = $1;", [table]);
    if (response.rows.length > 0) {
        return null;
    }

    const id = Number.parseInt((await execute("SELECT * FROM nextval('demand_ids');")).rows[0].nextval);
    await execute("INSERT INTO demand (id, table_pos) VALUES ($1, $2);", [id, table]);
    return id;
}

/**
 * 
 * @param {Number} id 
 * @param {Object} data 
 * @returns {Boolean}
 */
async function updateDemand(id, data) {
    let values = [id];
    let query = "";

    if (data.status != null) {
        values.push(data.status);
        query += ", status = $" + values.length;
    }

    if (data.demands != null && Array.isArray(data.demands)) {
        let _demands = [];

        for (let demandID of data.demands) {
            if (Number.isInteger(Number.parseInt(demandID))) {
                _demands.push(Number.parseInt(demandID));
            }
        }

        values.push(JSON.stringify(_demands));
        query += ", demands = $" + values.length;
    }

    if (query.length > 0) {
        query = query.replace(", ", "");

        const response = await await execute("UPDATE demand SET " + query + " WHERE id = $1;", values);
        return response.rowCount > 0;
    }

    return false;
}

module.exports = { init, router, getDemands, getDemand, createDemand, updateDemand };