import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IProduct, IVariant } from '../interfaces/IProduct.interface';

declare global {
	interface Window {
		dataLayer: any[];
	}
}

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {
	private platformId = inject(PLATFORM_ID);

	private pushToDataLayer(event: any) {
		if (isPlatformBrowser(this.platformId)) {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push(event);
		}
	}

	trackViewItem(product: IProduct) {
		this.pushToDataLayer({
			event: 'view_item',
			ecommerce: {
				items: [{
					item_id: product.sSku,
					item_name: product.sNameProduct,
					price: product.nRegularPrice,
					item_brand: product.sBrand,
					item_category: 'Farmacia'
				}]
			}
		});
	}

	trackAddToCart(product: IProduct, variant: IVariant, nQuantity: number) {
		this.pushToDataLayer({
			event: 'add_to_cart',
			ecommerce: {
				items: [{
					item_id: product.sSku,
					item_name: product.sNameProduct,
					price: variant.nPrice,
					item_brand: product.sBrand,
					item_variant: variant.sName,
					quantity: nQuantity
				}]
			}
		});
	}
}
