const express = require("express");
const router = express.Router();
const { execute } = require("../../../../database/databaseManager");
const { ProductResponse, Product } = require("./structures/index");

/**
 * @returns {Promise<void>}
 */
async function init() {
    await execute("CREATE SEQUENCE IF NOT EXISTS product_ids;");
    await execute("CREATE TABLE IF NOT EXISTS product (id INT PRIMARY KEY, title VARCHAR(50), description TEXT, price FLOAT DEFAULT 0, image INT DEFAULT 0);");

    const response = await execute("SELECT * FROM product;");
    if (response.rows.length <= 0) {
        await execute("INSERT INTO product (id, title, description, price) VALUES (nextval('product_ids'),$1,$2,$3)", ["Camarão Gratinato", "4 porções de arroz, camarão gratinado com cebola, tomate, requeijão e queijo mussarela", 29.99]);
        await execute("INSERT INTO product (id, title, description, price) VALUES (nextval('product_ids'),$1,$2,$3)", ["Gratinato de Peixe e Camarão", "4 porções de arroz, 5 batatas cozidas e camarão/peixe gratinado com cebola e queijo parmesão", 29.99]);
        await execute("INSERT INTO product (id, title, description, price) VALUES (nextval('product_ids'),$1,$2,$3)", ["Espaguete", "Espaguete com molho de anchovas e tomates", 14.99]);
    }

    router.use(require("./get"));
}

/**
 * @param {{offset?:0, limit?:100}}
 * @returns {Promise<ProductResponse>}
 */
async function getProducts({ offset = 0, limit = 100 } = {}) {
    const response = await execute("SELECT * FROM product OFFSET $1 LIMIT $2;", [offset, limit]);
    const total = Number.parseInt((await execute("SELECT count(id) FROM product;")).rows[0].count);

    if (response.rows.length > 0) {
        let _products = [];

        let i = 0;
        while (i < response.rows.length) {
            const row = response.rows[i];
            i++;
            _products.push(new Product(row.id, row.title, row.description, row.price, row.image));
        }

        return new ProductResponse(total, _products);
    }

    return new ProductResponse(total, []);
}


/**
 * @param {Number} id
 * @returns {Promise<Product | null>}
 */
async function getProduct(id) {
    const response = await execute("SELECT * FROM product WHERE id = $1;", [id]);

    if (response.rows.length > 0) {
        const row = response.rows[0];

        return new Product(row.id, row.title, row.description, row.price, row.image);
    }

    return null;
}


module.exports = { init, router, getProducts, getProduct };