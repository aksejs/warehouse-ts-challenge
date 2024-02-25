import { randomUUID } from "crypto";

import { Invoice, Packaging, PackageItem } from "../lib/types";
import { Queue } from "../lib/queue";
import { OrdersStore, ProductsStore } from "../store";
import { Order, OrderStatus } from "../models/order";

export class OrderService {
  readonly orderQueue: Queue<Order>;

  constructor(
    private productsStore: ProductsStore,
    private ordersStore: OrdersStore
  ) {
    const sortedOrders = Array.from(ordersStore.orders.values()).sort(
      (a, b) => a.installationDate.getTime() - b.installationDate.getTime()
    );
    this.orderQueue = new Queue(sortedOrders);
  }

  private buildPackageItems(articles: string[]) {
    const packageItemsMap = new Map<PackageItem["id"], PackageItem>();

    for (const article of articles) {
      const product = this.productsStore.getProductById(article)!;
      packageItemsMap.set(product.id, {
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: packageItemsMap.has(product.id)
          ? packageItemsMap.get(product.id)!.quantity + 1
          : 1,
      });
    }

    return packageItemsMap;
  }

  public processOrder(order: Order) {
    const packageItemsMap = this.buildPackageItems(order.articles);
    let totalPrice = 0;

    for (const packageItem of packageItemsMap.values()) {
      const product = this.productsStore.getProductById(packageItem.id)!;
      if (product.stock < packageItem.quantity) {
        throw new Error(
          `Cannot fulfill order ${order.id}, not enough stock for product ${product.name}`
        );
      }

      totalPrice += product.unitPrice * packageItem.quantity;
    }

    for (const packageItem of packageItemsMap.values()) {
      this.productsStore.updateStock(packageItem.id, packageItem.quantity);
    }

    const invoice: Invoice = {
      id: randomUUID(),
      orderId: order.id,
      articles: order.articles,
      totalPrice,
    };

    const packaging: Packaging = {
      orderId: order.id,
      items: Array.from(packageItemsMap.values()),
      installationDate: order.installationDate.toISOString(),
    };

    return { invoice, packaging };
  }

  public async processOrders() {
    while (this.orderQueue.tasksLeft > 0) {
      const currentOrder = this.orderQueue.dequeueOrder()!;
      try {
        console.log(`--- Processing order ${currentOrder.id} ---`);

        const { invoice, packaging } = this.processOrder(currentOrder);
        console.log("packaging", packaging);
        console.log("invoice", invoice);

        this.ordersStore.updateOrderStatus(
          currentOrder.id,
          OrderStatus.Fulfilled
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `Error processing order ${currentOrder.id}: ${error.message}`
          );
        }
        this.ordersStore.updateOrderStatus(
          currentOrder.id,
          OrderStatus.Canceled
        );
        // TODO: erorrQueue.enqueueOrder(currentOrder);
      } finally {
        console.log(`--- Order ${currentOrder.id} processed ---`);
      }
    }
  }
}
