require("dotenv/config");

module.exports = class Structure {

    /**
     * 
     * @param {Number} id 
     * @param {String} title 
     * @param {String} description 
     * @param {Number} price 
     * @param {Number} image 
     */
    constructor(id, title, description, price, image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    /**
     * @returns {String} Image URL
     */
    getImage() {
        return process.env.DOMAIN + "/api/v1/images/" + this.image;
    }
}