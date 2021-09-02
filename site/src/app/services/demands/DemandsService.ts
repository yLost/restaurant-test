import DemandResponse from "./structures/DemandResponse";
import { environment } from "src/environments/environment";
import Demand from "./structures/Demand";

export async function getDemands(): Promise<DemandResponse> {
    const response = await fetch(environment.api + "/v1/demands", {
        method: "GET",
        headers: {
            "Authorization": "adminpassword"
        }
    });

    return await response.json();
}

export async function getDemand(id: Number): Promise<Demand | null> {
    const response = await fetch(environment.api + "/v1/demands/" + id, {
        method: "GET",
        headers: {
            "Authorization": "adminpassword"
        }
    });

    const resp = await response.json();
    if (resp.id != null) {
        return resp;
    }

    return null;
}

export async function createDemand(table: Number): Promise<Number | null> {
    const response = await fetch(environment.api + "/v1/demands", {
        method: "POST",
        headers: {
            "Authorization": "adminpassword"
        },
        body: JSON.stringify({
            table: table
        })
    });

    const resp = await response.json();
    if (resp.id != null) {
        return resp.id;
    }

    return null;
}

export async function updateDemand(id: Number, { status = null, demands = null } = {}): Promise<Boolean> {

    const response = await fetch(environment.api + "/v1/demands/" + id, {
        method: "PATCH",
        headers: {
            "Authorization": "adminpassword"
        },
        body: JSON.stringify({
            status: status,
            demands: demands
        })
    });

    const resp = await response.json();
    return resp.message == "Success";
}