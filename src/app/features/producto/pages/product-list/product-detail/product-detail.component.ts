import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockDataService } from '../../../../../core/services/mock-data.service';
import { CartService } from '../../../../../core/services/cart.service';
import { SeoService } from '../../../../../core/services/seo.service';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { IProduct, IVariant } from '../../../../../core/interfaces/IProduct.interface';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card.component';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [DecimalPipe, RouterModule, ProductCardComponent, AccordionComponent, MatButtonModule, MatIconModule],
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private mockDataService = inject(MockDataService);
	private cartService = inject(CartService);
	private seoService = inject(SeoService);
	private analyticsService = inject(AnalyticsService);

	@ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

	product = signal<IProduct | null>(null);
	crossSellingProducts = signal<IProduct[]>([]);
	isLoading = signal(true);

	selectedVariant = signal<IVariant | null>(null);
	mainImage = signal<string>('');

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const sId = params.get('id') || '';
			this.isLoading.set(true);

			this.mockDataService.getProductById(sId).subscribe(product => {
				if (product) {
					this.product.set(product);
					this.seoService.setSeoData(product.sNameProduct, product.sDescription.substring(0, 150));
					this.analyticsService.trackViewItem(product);

					if (product.aVariants && product.aVariants.length > 0) {
						this.selectedVariant.set(product.aVariants[0]);
					}
					if (product.aImages && product.aImages.length > 0) {
						this.mainImage.set(product.aImages[0]);
					}
				}
				this.isLoading.set(false);
			});
		});

		this.mockDataService.getProducts().subscribe(products => {
			this.crossSellingProducts.set(products);
		});
	}

	selectVariant(variant: IVariant): void {
		this.selectedVariant.set(variant);
	}

	setMainImage(sImg: string): void {
		this.mainImage.set(sImg);
	}

	addToCart(product: IProduct): void {
		const variant = this.selectedVariant();
		if (variant) {
			this.cartService.addToCart(product, variant, 1);
			this.analyticsService.trackAddToCart(product, variant, 1);
		}
	}

	onCrossSellingAddToCart(event: { product: IProduct; variant: any }): void {
		this.cartService.addToCart(event.product, event.variant, 1);
		this.analyticsService.trackAddToCart(event.product, event.variant, 1);
	}

	scrollCarousel(sDirection: 'left' | 'right'): void {
		if (this.carousel) {
			const el = this.carousel.nativeElement;
			const nScrollAmount = 270;
			el.scrollBy({ left: sDirection === 'left' ? -nScrollAmount : nScrollAmount, behavior: 'smooth' });
		}
	}
}
