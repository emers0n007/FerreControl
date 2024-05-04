import {ProductModel} from "./ProductModel";

export class SaleModel{
  id_sale:number=0;
  sale_date:Date= new Date();
  total_price:number=0;
  saleDetail:Array<ProductModel>= new Array<ProductModel>();
  name_user:String = ' ';
}
