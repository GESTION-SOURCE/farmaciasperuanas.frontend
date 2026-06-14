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
}