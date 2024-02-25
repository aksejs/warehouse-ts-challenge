import { Api } from "../lib/api";
import { Product } from "../models/product";

export class ProductsStore {
  private products: Map<Product["id"], Product>;

  constructor(private api: Api) {
    this.api = api;
    this.products = new Map();
  }

  public async init() {
    await this.fetchProducts();
    if (!this.products.size) {
      throw new Error("No products found");
    }
  }

  public async fetchProducts() {
    const products = await this.api.fetchProducts();

    this.products = products.reduce((acc, product) => {
      acc.set(product.id, product);
      return acc;
    }, new Map());
  }

  public getProductById(id: string) {
    const product = this.products.get(id);
    if (!product) throw new Error(`Product ${id} not found`);

    return this.products.get(id);
  }

  public updateStock(id: string, quantity: number) {
    const product = this.products.get(id);

    if (!product) throw new Error(`Product ${id} not found`);

    return product.updateStock(quantity);
  }

  public getRestockList() {
    return Array.from(this.products.values()).filter(
      (product) => product.stock <= 0
    );
  }
}
