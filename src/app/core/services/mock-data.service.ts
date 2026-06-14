import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IProduct } from '../interfaces/IProduct.interface';

const generateProducts = (): IProduct[] => {
	const products: IProduct[] = [];
	for (let i = 1; i <= 12; i++) {
		products.push({
			sId: `${i}`,
			sSku: `SKU-${1000 + i}`,
			sNameProduct: i % 2 === 0 ? `Toallitas Húmedas Huggies Limpieza Cotidiana ${i}` : `Pharamol Antigripal 500 mg ${i}`,
			sBrand: i % 2 === 0 ? 'Huggies' : 'Inkafarma',
			sDescription: 'Producto simulado para la prueba técnica.',
			sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
			sComposition: 'Composición genérica del producto detallada para demostración.',
			sContraindications: 'No usar en caso de hipersensibilidad a los componentes.',
			aImages: [
				i % 2 === 0 ? 'assets/toallitas-humedas-huggies.png' : 'assets/tabletas-antigripal-pharamol.png'
			],
			nRegularPrice: 20.00 + i,
			nPromotionalPrice: i % 3 === 0 ? 15.00 + i : undefined,
			nCardPrice: i % 4 === 0 ? 12.00 + i : undefined,
			aVariants: [
				{ sId: `v1-${i}`, sName: i % 2 === 0 ? 'Bolsa 80 UN' : 'SOBRE X2 TABS 1 UN', nPrice: 20.00 + i },
				{ sId: `v2-${i}`, sName: i % 2 === 0 ? 'Caja 3 UN' : 'Caja 100 UN', nPrice: 50.00 + i }
			]
		});
	}
	return products;
};

const MOCK_PRODUCTS: IProduct[] = generateProducts();

@Injectable({
	providedIn: 'root'
})
export class MockDataService {
	getProducts(): Observable<IProduct[]> {
		return of(MOCK_PRODUCTS).pipe(delay(800));
	}

	getProductById(sId: string): Observable<IProduct | undefined> {
		const product = MOCK_PRODUCTS.find(p => p.sId === sId);
		return of(product).pipe(delay(500));
	}
}
