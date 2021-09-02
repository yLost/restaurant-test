const database = require("./db.js");

async function init() {
    await database.init();
}

async function execute(query) {
    return await database.query(query, []);
}

async function execute(query, values) {
    return await database.query(query, values);
}

async function base64(toBase) {
    return await database.utf8ToBase64(toBase);
}

async function utf8(toUTF) {
    return await database.base64ToUTF8(toUTF);
}

module.exports = { execute, base64, utf8, init };