import crypto from "crypto";

export interface Order {
  id: string;
  lsOrderId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  productName: string;
  variantId: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
