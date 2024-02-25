import { Api } from "../src/api";
import { getJSON } from "../src/lib/helpers";
import { OrderReponse, ProductResponse, ProductType } from "../src/lib/types";
import { Order } from "../src/models/order";
import { Product } from "../src/models/product";

jest.mock("../src/lib/helpers");

describe("Api", () => {
  let api: Api;

  beforeEach(() => {
    api = new Api();
  });

  describe("Api", () => {
    let api: Api;

    beforeEach(() => {
      api = new Api();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("fetchHeatPumps", () => {
      it("fetches heat pumps from the server", async () => {
        const mockProducts: ProductResponse[] = [
          {
            id: "1",
            name: "Heat Pump 1",
            stock: 10,
            unitPrice: 1000,
            productCode: "HP-1",
          },
        ];
        (getJSON as jest.Mock).mockResolvedValue(mockProducts);

        const result = await api.fetchHeatPumps();

        expect(result[0]).toBeInstanceOf(Product);
      });

      it("returns an empty array if no products are fetched", async () => {
        (getJSON as jest.Mock).mockResolvedValue(null);

        const result = await api.fetchHeatPumps();

        expect(result).toEqual([]);
        expect(getJSON).toHaveBeenCalledWith(
          expect.stringContaining("heatPumps")
        );
      });
    });

    describe("fetchOrders", () => {
      it("fetches orders from the server", async () => {
        const mockOrders: OrderReponse[] = [
          {
            id: "1",
            articles: ["1"],
            installationDate: new Date().toISOString(),
          },
        ];
        (getJSON as jest.Mock).mockResolvedValue(mockOrders);

        const result = await api.fetchOrders();

        expect(result[0]).toBeInstanceOf(Order);
      });

      it("returns an empty array if no orders are fetched", async () => {
        (getJSON as jest.Mock).mockResolvedValue(null);

        const result = await api.fetchOrders();

        expect(result).toEqual([]);
      });
    });
  });
});
