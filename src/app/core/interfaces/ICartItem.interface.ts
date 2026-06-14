import { IProduct, IVariant } from './IProduct.interface';

export interface ICartItem {
	sId: string;
	oProduct: IProduct;
	oVariant: IVariant;
	nQuantity: number;
}
