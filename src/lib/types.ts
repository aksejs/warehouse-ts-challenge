import { randomUUID } from "crypto";

export type OrderReponse = {
  id: string;
  articles: Array<string>;
  installationDate: string;
};

export type ProductResponse = {
  id: string;
  productCode: string;
  name: string;
  description?: string;
  stock: number;
  unitPrice?: number;
};

export enum ProductType {
  HeatPump = "heatPump",
  InstallationMaterial = "installationMaterial",
  Tool = "tool",
}

export type PackageItem = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
};

export type Invoice = {
  id: string;
  orderId: string;
  articles: string[];
  totalPrice: number;
};

export type Packaging = {
  orderId: string;
  items: PackageItem[];
  installationDate: string;
};
