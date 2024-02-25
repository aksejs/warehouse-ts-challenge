import { getJSON } from "../lib/helpers";
import { OrderReponse, ProductResponse, ProductType } from "../lib/types";
import { Order } from "../models/order";
import { Product } from "../models/product";

export class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BASE_URL || "http://localhost:3000/";
  }

  public async fetchHeatPumps() {
    const products = await getJSON<ProductResponse[]>(
      this.baseUrl + "heatPumps"
    );
    if (!products) return [];

    return products.map(
      (product) => new Product(product, ProductType.HeatPump)
    );
  }

  public async fetchInstallationMaterials() {
    const products = await getJSON<ProductResponse[]>(
      this.baseUrl + "installationMaterials"
    );
    if (!products) return [];

    return products.map(
      (product) => new Product(product, ProductType.InstallationMaterial)
    );
  }

  public async fetchTools() {
    const products = await getJSON<ProductResponse[]>(this.baseUrl + "tools");
    if (!products) return [];

    return products.map((product) => new Product(product, ProductType.Tool));
  }

  public async fetchProducts() {
    const products = await Promise.all([
      this.fetchHeatPumps(),
      this.fetchInstallationMaterials(),
      this.fetchTools(),
    ]);

    return products.flat();
  }

  public async fetchOrders() {
    const orders = await getJSON<OrderReponse[]>(this.baseUrl + "orders");
    if (!orders) return [];

    return orders.map((order) => new Order(order));
  }
}
