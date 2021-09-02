const { Product } = require("./Product");

module.exports = class Structure {

    /**
     * @param {Number} total 
     * @param {Product[]} products 
     */
    constructor(total, products) {
        this.total = total;
        this.products = products;
    }
}