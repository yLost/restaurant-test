import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import Demand from "src/app/services/demands/structures/Demand";
import { getProducts } from "src/app/services/products/ProductsService";
import ProductResponse from "src/app/services/products/structures/ProductResponse";
import Product from "src/app/services/products/structures/Product";

@Component({
    selector: "app-attendant-table",
    templateUrl: "./table.html",
    styleUrls: ["./table.scss"]
})
export default class App implements OnInit {

    @Input()
    demand: Demand | null = null;

    @Output()
    close = new EventEmitter<any>();

    @Output()
    toggleProducts = new EventEmitter<any>();

    @Output()
    cancelDemand = new EventEmitter<any>();

    @Output()
    checkout = new EventEmitter<any>();

    productsResponse: ProductResponse | null = null;

    ngOnInit(): void {
        getProducts().then(response => this.productsResponse = response);
    }

    viewProducts(): void {
        this.toggleProducts.emit("switch");
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