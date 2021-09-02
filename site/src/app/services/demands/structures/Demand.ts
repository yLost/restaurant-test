import DemandStatus from "./DemandStatus";

export default interface Demand {

    id: Number;
    table: Number;
    demands: Number[];
    status: typeof DemandStatus;
}