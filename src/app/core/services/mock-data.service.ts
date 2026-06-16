import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IProduct } from '../interfaces/IProduct.interface';

const MOCK_PRODUCTS: IProduct[] = [
	{
		sId: '1',
		sSku: 'SKU-1001',
		sNameProduct: 'Pharamol Antigripal 500 mg 1',
		sBrand: 'Inkafarma',
		sDescription: '<ul><li>¿Qué es PHARAMOL ANTIGRIPAL 500mg+5mg+2mg Tableta Recubierta y para qué se utiliza?</li><li>Es un medicamento que contiene: paracetamol que funciona para evitar que los mensajes de dolor lleguen al cerebro, también actúa en el cerebro para reducir la fiebre. La fenilefrina es un descongestionante nasal y la clorfenamina pertenece a un grupo de medicamentos llamados antihistamínicos que alivian la alergia.</li></ul>',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Composición genérica del producto detallada para demostración.',
		sContraindications: 'No usar en caso de hipersensibilidad a los componentes.',
		aImages: [
			'assets/products/pharamol/caja-antigripal-pharamol.jpg',
			'assets/products/pharamol/sobre-antigripal-pharamol.jpg',
			'assets/products/pharamol/tabletas-antigripal-pharamol.png'
		],
		aThumbnails: [
			'assets/products/pharamol/thumbnail/caja-antigripal-pharamol-thumbnail.jpg',
			'assets/products/pharamol/thumbnail/sobre-antigripal-pharamol-thumbnail.png',
			'assets/products/pharamol/thumbnail/tabletas-antigripal-pharamol-thumbnail.png'
		],
		nRegularPrice: 21.00,
		nPromotionalPrice: undefined,
		nCardPrice: undefined,
		aVariants: [
			{ sId: 'v1-1', sName: 'SOBRE X2 TABS 1 UN', nPrice: 21.00, sImage: 'assets/products/pharamol/sobre-antigripal-pharamol.jpg' },
			{ sId: 'v2-1', sName: 'Caja 100 UN', nPrice: 51.00, sImage: 'assets/products/pharamol/caja-antigripal-pharamol.jpg' }
		]
	},
	{
		sId: '2',
		sSku: 'SKU-1002',
		sNameProduct: 'Toallitas Húmedas Huggies Limpieza Cotidiana 2',
		sBrand: 'Huggies',
		sDescription: 'Producto simulado para la prueba técnica.',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Composición genérica del producto detallada para demostración.',
		sContraindications: 'No usar en caso de hipersensibilidad a los componentes.',
		aImages: [
			'assets/products/huggies/toallitas-humedas-huggies.png',
			'assets/products/huggies/toallitas-humedas-huggies-184-und.png'
		],
		aThumbnails: [
			'assets/products/huggies/thumbnail/toallitas-humedas-huggies-thumbnail.png',
			'assets/products/huggies/thumbnail/toallitas-humedas-huggies-184-und-thumbnail.png'
		],
		nRegularPrice: 22.00,
		nPromotionalPrice: undefined,
		nCardPrice: undefined,
		aVariants: [
			{ sId: 'v1-2', sName: 'Bolsa 80 UN', nPrice: 22.00 },
			{ sId: 'v2-2', sName: 'Caja 3 UN', nPrice: 52.00, sImage: 'assets/products/huggies/toallitas-humedas-huggies-184-und.png' }
		]
	},
	{
		sId: '3',
		sSku: 'SKU-1003',
		sNameProduct: 'Colágeno Hidrolizado',
		sBrand: 'Inkafarma',
		sDescription: '<ul><li>Suplemento alimenticio a base de colágeno.</li><li>Ideal para el cuidado de articulaciones, piel, cabello y uñas. Ayuda a mantener la elasticidad y proporciona los nutrientes necesarios.</li></ul>',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Colágeno hidrolizado, Vitamina C, Magnesio.',
		sContraindications: 'No usar en caso de hipersensibilidad a los componentes. Mujeres embarazadas o en periodo de lactancia deben consultar a su médico antes de usar.',
		aImages: [
			'assets/products/colageno/colageno.jpg',
			'assets/products/colageno/colageno-pack2.jpg',
			'assets/products/colageno/colageno-pack3.jpg'
		],
		aThumbnails: [
			'assets/products/colageno/thumbnail/colageno-thumbnail.jpg',
			'assets/products/colageno/thumbnail/colageno-pack2-thumbnail.jpg',
			'assets/products/colageno/thumbnail/colageno-pack3-thumbnail.jpg'
		],
		nRegularPrice: 65.00,
		nPromotionalPrice: 55.00,
		nCardPrice: 49.00,
		aVariants: [
			{ sId: 'v1-3', sName: 'Frasco 300g', nPrice: 65.00, sImage: 'assets/products/colageno/colageno.jpg' },
			{ sId: 'v2-3', sName: 'Pack 2 Frascos', nPrice: 120.00, sImage: 'assets/products/colageno/colageno-pack2.jpg' }
		]
	},
	{
		sId: '4',
		sSku: 'SKU-1006',
		sNameProduct: 'Guantes de Látex Alkhofar Talla M',
		sBrand: 'Alkhofar',
		sDescription: '<ul><li>Guantes de examinación de látex ligeramente empolvados.</li><li>Talla M, ambidiestros y descartables. Protegen contra microorganismos y sustancias químicas.</li></ul>',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Látex natural.',
		sContraindications: 'No usar en personas con hipersensibilidad al látex.',
		aImages: [
			'assets/products/guantes-latex-alkhofar/guantes-latex-alkhofar-talla-m.jpg'
		],
		aThumbnails: [
			'assets/products/guantes-latex-alkhofar/thumbnail/guantes-latex-alkhofar-talla-m-thumbnail.jpg'
		],
		nRegularPrice: 15.00,
		nPromotionalPrice: undefined,
		nCardPrice: 12.00,
		aVariants: [
			{ sId: 'v1-6', sName: 'Caja x 100 UN', nPrice: 15.00, sImage: 'assets/products/guantes-latex-alkhofar/guantes-latex-alkhofar-talla-m.jpg' }
		]
	},
	{
		sId: '5',
		sSku: 'SKU-1007',
		sNameProduct: 'Papel Toalla Scott Multiuso 2 Und',
		sBrand: 'Scott',
		sDescription: '<ul><li>Papel toalla súper absorbente y ultra resistente.</li><li>Ideal para la limpieza de cocina y superficies múltiples del hogar. Rinde más gracias a su tecnología de absorción.</li></ul>',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Celulosa virgen y fibras recicladas.',
		sContraindications: 'Ninguna conocida.',
		aImages: [
			'assets/products/papel-toalla/papel-toalla-scott-2-und.jpg'
		],
		aThumbnails: [
			'assets/products/papel-toalla/thumbnail/papel-toalla-scott-2-und-thumbnail.jpg'
		],
		nRegularPrice: 6.50,
		nPromotionalPrice: 5.00,
		nCardPrice: undefined,
		aVariants: [
			{ sId: 'v1-7', sName: 'Paquete 2 UN', nPrice: 6.50, sImage: 'assets/products/papel-toalla/papel-toalla-scott-2-und.jpg' }
		]
	},
	{
		sId: '6',
		sSku: 'SKU-1008',
		sNameProduct: 'Bálsamo Labial Nivea',
		sBrand: 'Nivea',
		sDescription: '<ul><li>Protector labial con fórmula humectante intensiva.</li><li>Brinda hidratación profunda por 24 horas y protege los labios contra la resequedad ocasionada por el clima.</li></ul>',
		sLongDescription: 'Este producto es distribuido por Inretail Pharma S.A.',
		sComposition: 'Manteca de karité, aceites naturales.',
		sContraindications: 'Solo para uso externo. Detener uso en caso de irritación.',
		aImages: [
			'assets/products/balsamo/balsamo-nivea.jpg',
		],
		aThumbnails: [
			'assets/products/balsamo/thumbnail/balsamo-nivea-thumbnail.jpg',
		],
		nRegularPrice: 10.90,
		nPromotionalPrice: 8.50,
		nCardPrice: undefined,
		aVariants: [
			{ sId: 'v1-8', sName: 'Stick 4.8g', nPrice: 10.90, sImage: 'assets/products/balsamo/balsamo-nivea.jpg' }
		]
	}
];

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