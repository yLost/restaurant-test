import { Component, OnInit } from "@angular/core";
import { deleteDemand, getDemand, getDemands } from "src/app/services/demands/DemandsService";
import Demand from "src/app/services/demands/structures/Demand";
import DemandResponse from "src/app/services/demands/structures/DemandResponse";
import { getProducts } from "src/app/services/products/ProductsService";
import ProductResponse from "src/app/services/products/structures/ProductResponse";
import Product from "src/app/services/products/structures/Product";
import DemandStatus from "src/app/services/demands/structures/DemandStatus";

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
    createDemand: Boolean = true;

    ngOnInit(): void {
        this.loadDemands();
        this.loadProducts();
    }

    async loadProducts(): Promise<void> {
        const response = await getProducts();
        this.productsResponse = response;
    }

    async loadDemands(): Promise<void> {
        this.demandResponse = null;
        const response = await getDemands();
        this.demandResponse = response;
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

    parseDemandStatus(statusCode: Number): String {
        switch (statusCode) {
            case DemandStatus.AWAITING_NEW_DEMANDS:
                return "Aguardando pedido";
            case DemandStatus.CLOSED:
                return "Pedido encerrado";
            case DemandStatus.OPEN:
                return "Em aberto";
            case DemandStatus.PROCESSING:
                return "Em preparo";
        }

        return "Não encontrado";
    }

    async cancelOpenedDemand(): Promise<void> {
        if (!this.viewDemand) {
            return;
        }

        const response = await deleteDemand(this.viewDemand.id);
        if (response) {
            this.viewDemand.status = DemandStatus.CLOSED;
            this.viewDemand = null;
        }
    }

    async checkoutOpened(): Promise<void> {

    }

    async onCreateDemand(id: Number): Promise<void> {
        this.createDemand = false;

        await this.loadDemands();

        const _demandFound = this.demandResponse?.demands.find(demand => demand.id == id);

        if (_demandFound) {
            this.viewDemand = _demandFound;
        }
    }
}