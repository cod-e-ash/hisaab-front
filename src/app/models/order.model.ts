export interface Order {
  _id: string;
  orderno: string;
  date: Date;
  custid: string;
  total: number;
  discount: number;
  discountamount: number;
  totaltax: number;
  pkgdly: number;
  finalamount: number;
  details: {
    itemno: number;
    name: string;
    hsn: string;
    mrp: number;
    quantity: number;
    margin: number;
    discountpercentage: number;
    discountamount: number;
    rate: number;
    taxamount: number;
    totalamount: number;
  };
  }

