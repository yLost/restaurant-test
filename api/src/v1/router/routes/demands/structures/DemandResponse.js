const Demand = require("./Demand");

module.exports = class Structure {

    /**
     * @param {Demand[]} demands 
     */
    constructor(demands) {
        this.demands = demands;
    }

}