import {SupplierModel} from "./SupplierModel";
import {MarkModel} from "./MarkModel";

export class ProductModel{
  name: String = ' ';
  id_product: number = 0;
  stock: number = 0;
  price_buy: number = 0;
  price_sale: number = 0;
  supplier: SupplierModel = new SupplierModel();
  status: number =0;
  description_presentation:number=0;
  presentation:string=' ';
  mark:MarkModel= new MarkModel();
}
