import { Api } from "../lib/api";
import { Order, OrderStatus } from "../models/order";

export class OrdersStore {
  public orders: Map<Order["id"], Order>;

  constructor(private api: Api) {
    this.api = api;
    this.orders = new Map();
  }

  public async init() {
    await this.fetchOrders();
    if (!this.orders.size) {
      throw new Error("No orders found");
    }
  }

  public updateOrderStatus(id: string, status: OrderStatus) {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order ${id} not found`);
    }
    order.updateStatus(status);
  }

  public getCancelledOrders() {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === OrderStatus.Canceled
    );
  }

  private async fetchOrders() {
    const orders = await this.api.fetchOrders();
    this.orders = orders.reduce((acc, order) => {
      acc.set(order.id, order);
      return acc;
    }, new Map());
  }
}
