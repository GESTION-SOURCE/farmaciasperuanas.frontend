import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class SeoService {
	private titleService = inject(Title);
	private metaService = inject(Meta);
	private dom = inject(DOCUMENT);

	setSeoData(title: string, description: string) {
		this.titleService.setTitle(`${title} | Inkafarma`);
		this.metaService.updateTag({ name: 'description', content: description });
		this.updateCanonicalUrl();
	}

	private updateCanonicalUrl() {
		const head = this.dom.getElementsByTagName('head')[0];
		let element: HTMLLinkElement | null = this.dom.querySelector(`link[rel='canonical']`);
		if (!element) {
			element = this.dom.createElement('link') as HTMLLinkElement;
			element.setAttribute('rel', 'canonical');
			head.appendChild(element);
		}
		element.setAttribute('href', this.dom.URL.split('?')[0]);
	}

	addJsonLd(product: any) {
		const head = this.dom.getElementsByTagName('head')[0];
		
		const existingScript = this.dom.querySelector('#structured-data');
		if (existingScript) {
			head.removeChild(existingScript);
		}

		const script = this.dom.createElement('script');
		script.id = 'structured-data';
		script.type = 'application/ld+json';
		
		const cleanDesc = product.sDescription ? product.sDescription.replace(/<[^>]*>?/gm, '') : '';
		const price = product.nPromotionalPrice || product.nRegularPrice || 0;

		script.text = JSON.stringify({
			"@context": "https://schema.org/",
			"@type": "Product",
			"name": product.sNameProduct,
			"image": product.aImages?.[0] || '',
			"description": cleanDesc,
			"sku": product.sSku,
			"brand": {
				"@type": "Brand",
				"name": product.sBrand
			},
			"offers": {
				"@type": "Offer",
				"url": this.dom.URL,
				"priceCurrency": "PEN",
				"price": price,
				"availability": "https://schema.org/InStock"
			}
		}).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

		head.appendChild(script);
	}
}