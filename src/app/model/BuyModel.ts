import {ProductModel} from "./ProductModel";

export class BuyModel{
  id_buy:number=0;
  id_supplier:number=0;
  purchase_date:Date= new Date();
  total_price:number=0;
  buyDetail:Array<ProductModel>= new Array<ProductModel>();
  name_user:String = ' ';
}
