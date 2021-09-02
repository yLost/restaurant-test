const DemandStatus = require("./DemandStatus");

module.exports = class Structure {

    /**
     * @param {Number} id 
     * @param {Number} table 
     * @param {Number[]} demands 
     * @param {DemandStatus} status 
     */
    constructor(id, table, demands, status) {
        this.id = id;
        this.table = table;
        this.demands = demands;
        this.status = status;
    }
}