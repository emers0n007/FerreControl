import {SupplierModel} from "./SupplierModel";

export class ProductModel{
  name: String = ' ';
  id_product: number = 0;
  stock: number = 0;
  price_buy: number = 0;
  price_sale: number = 0;
  supplier: SupplierModel = new SupplierModel();
  status: number =0;
  description_presentation:String=' ';
  presentation=0;
  id_mark=0;
}
