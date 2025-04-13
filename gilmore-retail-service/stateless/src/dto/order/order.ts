export type Address = {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
};

export type Order = {
  id: string;
  created: string;
  updated: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  total: number;
};
