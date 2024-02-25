import { ProductResponse, ProductType } from "../lib/types";

export class Product {
  id: string;
  productCode: string;
  name: string;
  description?: string;
  stock: number;
  unitPrice: number;
  type: ProductType;

  constructor(productResponse: ProductResponse, type: ProductType) {
    this.id = productResponse.id;
    this.productCode = productResponse.productCode;
    this.name = productResponse.name;
    this.description = productResponse.description;
    this.stock = productResponse.stock;
    this.unitPrice = productResponse.unitPrice || 0;
    this.type = type;
  }

  public updateStock(quantity: number) {
    if (this.stock - quantity > 0) {
      this.stock = this.stock - quantity;
      return true;
    }

    return false;
  }
}
