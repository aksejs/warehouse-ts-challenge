import { Api } from "./lib/api";
import { OrderService } from "./services";
import { OrdersStore, ProductsStore } from "./store";

async function main() {
  const api = new Api();
  const productsStore = new ProductsStore(api);
  const ordersStore = new OrdersStore(api);

  await Promise.all([productsStore.init(), ordersStore.init()]);

  const orderService = new OrderService(productsStore, ordersStore);

  orderService.processOrders();
  productsStore.getRestockList().forEach((product) => {
    console.log(`Product ${product.name} is out of stock`);
  });
  ordersStore.getCancelledOrders().forEach((order) => {
    console.log(`Order ${order.id} has been cancelled`);
  });
}

main();
