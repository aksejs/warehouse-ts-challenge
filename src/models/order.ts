import { OrderReponse } from "../lib/types";

export enum OrderStatus {
  Pending = "pending",
  Fulfilled = "fulfilled",
  Canceled = "canceled",
}

export class Order {
  id: string;
  articles: Array<string>;
  installationDate: Date;
  status: OrderStatus;

  constructor(orderResponse: OrderReponse) {
    this.id = orderResponse.id;
    this.articles = orderResponse.articles;
    this.installationDate = new Date(orderResponse.installationDate);
    this.status = OrderStatus.Pending;
  }

  public updateStatus(status: OrderStatus) {
    this.status = status;
  }
}
