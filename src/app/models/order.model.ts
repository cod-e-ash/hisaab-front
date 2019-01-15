import { Product } from './product.model';
import { Customer } from './customer.model';

export interface Order {
  _id?: string;
  orderno?: string;
  date?: Date;
  customer?: Customer;
  total?: number;
  discountrate?: number;
  discount?: number;
  totaltax?: number;
  finalamount?: number;
  details?: OrderDetails[];
  }

export interface OrderDetails {
  itemno: number;
  product: Product;
  quantity: number;
  discountrate: number;
  discount: number;
  price: number;
  tax: number;
  total: number;
}
