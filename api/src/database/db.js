const { Pool } = require("pg");
require('dotenv').config();

let connection = undefined;

function init() {
    return new Promise((res, rej) => {
        try {
            new Pool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
                password: process.env.DB_PASS,
                port: process.env.DB_PORT
            }).connect().then(conn => {
                connection = conn;
                res(true);
            }).catch(err => {
                rej(err);
            });
        } catch (err) {
            rej(err);
        }
    });
}

function getConnection() {
    return connection;
}

async function base64ToUTF8(value) {
    if (!value) {
        return "";
    }

    try {
        value = Buffer.from(new String(value), 'base64').toString('utf8');;
    } catch (err) {
        console.log("Failed to convert \"base64\" to \"UTF8\"" + err);
        return "";
    }

    return value;
}

async function utf8ToBase64(value) {
    if (!value) {
        return "";
    }

    try {
        value = Buffer.from(new String(value)).toString('base64');;
    } catch (err) {
        console.log("Failed to convert \"UTF8\" to \"base64\"" + err);
        return "";
    }

    return value;
}

async function query(_query, _values) {
    if (!connection) {
        console.log("\n\n CONNECTION WITH DATABASE WAS CLOSED!\n\n");
        process.exit(1);
    }
    return new Promise(async (success, reject) => {
        connection.query({ text: _query, values: _values }).then(result => {
            success(result);
        }).catch(err => {
            if (_values != null && _values.length > 0) {
                console.log("Reject sql promise => \n" + err.stack + "\n\nAt query: " + _query + " with values " + _values + "\n\n");
            } else {
                console.log("Reject sql promise => \n" + err.stack + "\n\nAt query: " + _query + "\n\n");
            }
            reject(err);
        });
    });
}

module.exports = { getConnection, init, query, utf8ToBase64, base64ToUTF8 };