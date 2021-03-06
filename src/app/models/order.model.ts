import { Product } from './product.model';
import { Customer } from './customer.model';

export interface Order {
  _id?: string;
  orderno?: string;
  date?: Date;
  customername?: string;
  customer?: Customer;
  total?: number;
  discountrate?: number;
  discount?: number;
  totaltax?: number;
  finalamount?: number;
  details?: OrderDetails[];
  status?: string;
  }

export interface OrderDetails {
  itemno: number;
  product: Product;
  quantity: number;
  discountrate: number;
  discount: number;
  price: number;
  taxrate: string;
  tax: number;
  total: number;
}
