import ProductResponse from "./structures/ProductResponse";
import { environment } from "src/environments/environment";
import Product from "./structures/Product";

export async function getProducts(): Promise<ProductResponse> {
    const response = await fetch(environment.api + "/v1/products", {
        method: "GET",
        headers: {
            "Authorization": "adminpassword"
        }
    });

    return await response.json();
}

export async function getProduct(id: Number): Promise<Product | null> {
    const response = await fetch(environment.api + "/v1/product/" + id, {
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