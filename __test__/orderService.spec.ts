import { OrderService } from "../src/services";
import { ProductsStore, OrdersStore } from "../src/store";
import { Order, OrderStatus } from "../src/models/order";
import { Api } from "../src/lib/api";
import { Product } from "../src/models/product";
import { ProductType } from "../src/lib/types";

describe("OrderService", () => {
  let productsStore: ProductsStore;
  let ordersStore: OrdersStore;
  let orderService: OrderService;
  let api: Api;

  beforeEach(async () => {
    api = new Api();
    productsStore = new ProductsStore(api);
    ordersStore = new OrdersStore(api);
    jest.spyOn(api, "fetchOrders").mockResolvedValue([
      new Order({
        id: "fi2304imf-df2n4ij-dfngdn394j",
        articles: ["gj02394ijk2-gvdfjng3-btdiu9fvhu2345-dds04i2"],
        installationDate: "2024-01-10T00:00:00.000Z",
      }),
    ]);
    jest.spyOn(api, "fetchProducts").mockResolvedValue([
      new Product(
        {
          id: "gj02394ijk2-gvdfjng3-btdiu9fvhu2345-dds04i2",
          name: "Product 1",
          description: "Description for Product 1",
          stock: 10,
          productCode: "P1",
          unitPrice: 1000,
        },
        ProductType.HeatPump
      ),
    ]);
    await Promise.all([productsStore.init(), ordersStore.init()]);
    orderService = new OrderService(productsStore, ordersStore);
  });

  describe("processOrder", () => {
    it("process order query successfully", async () => {
      orderService.processOrders();
      expect(
        ordersStore.orders.get("fi2304imf-df2n4ij-dfngdn394j")!.status
      ).toBe(OrderStatus.Fulfilled);
    });
    it("processes order successfully", () => {
      const order = orderService.orderQueue.dequeueOrder()!;
      const { invoice, packaging } = orderService.processOrder(order);

      expect(productsStore.getProductById(order.articles[0])!.stock).toBe(9);
      expect(invoice).toBeDefined();
      expect(packaging).toBeDefined();
    });
  });
});
