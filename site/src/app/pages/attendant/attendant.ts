import { Component, OnInit } from "@angular/core";
import { getDemand, getDemands } from "src/app/services/demands/DemandsService";
import Demand from "src/app/services/demands/structures/Demand";
import DemandResponse from "src/app/services/demands/structures/DemandResponse";
import { getProducts } from "src/app/services/products/ProductsService";
import ProductResponse from "src/app/services/products/structures/ProductResponse";
import Product from "src/app/services/products/structures/Product";

@Component({
    selector: "app-attendant",
    templateUrl: "./attendant.html",
    styleUrls: ["./attendant.scss"]
})
export default class App implements OnInit {

    demandResponse: DemandResponse | null = null;
    viewDemand: Demand | null = null;
    viewProducts = false;
    productsResponse: ProductResponse | null = null;

    ngOnInit(): void {
        this.loadDemands();
        getProducts().then(response => this.productsResponse = response);
    }

    async loadDemands(): Promise<void> {
        this.demandResponse = null;
        const response = await getDemands();
        this.demandResponse = response;
        console.log(this.demandResponse)

        this.viewDemand = this.demandResponse.demands[0];
    }

    async setDemand(id: Number): Promise<boolean> {
        this.viewProducts = false;
        const _demand = await getDemand(id);
        if (_demand != null) {
            this.viewDemand = _demand;
        }
        return false;
    }

    getProduct(id: Number): Product | null {
        if (this.productsResponse) {
            const product = this.productsResponse.products.find(product => product.id == id);
            if (product) {
                return product;
            }
        }
        return null;
    }
}