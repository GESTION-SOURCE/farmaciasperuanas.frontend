export interface IVariant {
	sId: string;
	sName: string;
	nPrice: number;
}

export interface IProduct {
	sId: string;
	sSku: string;
	sNameProduct: string;
	sDescription: string;
	sLongDescription: string;
	sComposition: string;
	sContraindications: string;
	aImages: string[];
	nRegularPrice: number;
	nPromotionalPrice?: number;
	nCardPrice?: number;
	aVariants: IVariant[];
	sBrand?: string;
}