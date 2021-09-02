import Product from "./Product";

export default interface ProductResponse {
    total: Number;
    products: Product[];
}