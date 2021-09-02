import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { getProducts } from "src/app/services/products/ProductsService";
import ProductResponse from "src/app/services/products/structures/ProductResponse";

@Component({
    selector: "app-attendant-products",
    templateUrl: "./products.html",
    styleUrls: ["./products.scss"]
})
export default class App implements OnInit {

    productsResponse: ProductResponse | null = null;

    @Input()
    products: Number[] = [];

    @Output()
    close = new EventEmitter<any>();

    ngOnInit(): void {
        getProducts().then(response => this.productsResponse = response);
    }

    end(): void {
        this.close.emit(this.products);
    }

    hasProduct(id: Number): Boolean {
        const index = this.products.indexOf(id);
        return index != -1;
    }

    addProduct(id: Number): void {
        const index = this.products.indexOf(id);
        if (index != -1) {
            this.products.splice(index, 1);
        } else {
            this.products.push(id);
        }
    }
}