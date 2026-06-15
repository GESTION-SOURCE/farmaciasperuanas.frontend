import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IProduct, IVariant } from '../../../../core/interfaces/IProduct.interface';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { CartService } from '../../../../core/services/cart.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { SeoService } from '../../../../core/services/seo.service';
import { AccordionComponent } from '../../../../shared/components/accordion/accordion.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { DiscountTagComponent } from '../../../../shared/components/discount-tag/discount-tag';
import { FavoriteButton } from '../../../../shared/components/favorite-button/favorite-button';
import { ProductDetailSkeletonComponent } from './components/product-detail-skeleton/product-detail-skeleton.component';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [DecimalPipe, RouterModule, ProductCardComponent, AccordionComponent, MatButtonModule, MatIconModule, DiscountTagComponent, UpperCasePipe, FavoriteButton, ProductDetailSkeletonComponent],
	templateUrl: './product-detail.component.html',
	styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private mockDataService = inject(MockDataService);
	private cartService = inject(CartService);
	private seoService = inject(SeoService);
	private analyticsService = inject(AnalyticsService);

	@ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
	@ViewChild('descContent') descContent!: ElementRef<HTMLDivElement>;
	@ViewChild('thumbnailsContainer') thumbnailsContainer!: ElementRef<HTMLDivElement>;

	product = signal<IProduct | null>(null);
	crossSellingProducts = signal<IProduct[]>([]);
	isLoading = signal(true);

	selectedVariant = signal<IVariant | null>(null);
	mainImage = signal<string>('');
	isDescriptionExpanded = signal(false);
	showVerMasBtn = signal(false);
	isZoomed = signal(false);
	zoomOrigin = signal('center center');
	isFavorite = signal(false);
	isAnimating = signal(false);

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
						if (product.aVariants[0].sImage) {
							this.mainImage.set(product.aVariants[0].sImage);
						} else if (product.aImages && product.aImages.length > 0) {
							this.mainImage.set(product.aImages[0]);
						}
					} else if (product.aImages && product.aImages.length > 0) {
						this.mainImage.set(product.aImages[0]);
					}
					setTimeout(() => this.checkDescriptionOverflow(), 50);
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
		if (variant.sImage) {
			this.setMainImage(variant.sImage);
		}
	}

	setMainImage(sImg: string): void {
		this.mainImage.set(sImg);
	}

	toggleDescription(): void {
		this.isDescriptionExpanded.update(v => !v);
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

	checkDescriptionOverflow(): void {
		if (this.descContent) {
			const el = this.descContent.nativeElement;
			this.showVerMasBtn.set(el.scrollHeight > el.clientHeight);
		}
	}

	onMouseMove(event: MouseEvent): void {
		this.isZoomed.set(true);
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		this.zoomOrigin.set(`${x}% ${y}%`);
	}

	onMouseLeave(): void {
		this.isZoomed.set(false);
		this.zoomOrigin.set('center center');
	}

	scrollThumbnails(sDirection: 'up' | 'down'): void {
		if (this.thumbnailsContainer) {
			const el = this.thumbnailsContainer.nativeElement;
			const scrollAmount = 80;
			el.scrollBy({ top: sDirection === 'up' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
		}
	}

	toggleFavorite(event: Event): void {
		event.stopPropagation();
		this.isFavorite.update(v => !v);
		this.isAnimating.set(true);
		setTimeout(() => this.isAnimating.set(false), 800);
	}

	isDragging = false;
	startY = 0;
	scrollTop = 0;

	onThumbnailsMouseDown(e: MouseEvent): void {
		if (!this.thumbnailsContainer) return;
		this.isDragging = true;
		const el = this.thumbnailsContainer.nativeElement;
		this.startY = e.pageY - el.offsetTop;
		this.scrollTop = el.scrollTop;
		el.style.cursor = 'grabbing';
	}

	onThumbnailsMouseLeave(): void {
		this.isDragging = false;
		if (this.thumbnailsContainer) this.thumbnailsContainer.nativeElement.style.cursor = 'grab';
	}

	onThumbnailsMouseUp(): void {
		this.isDragging = false;
		if (this.thumbnailsContainer) this.thumbnailsContainer.nativeElement.style.cursor = 'grab';
	}

	onThumbnailsMouseMove(e: MouseEvent): void {
		if (!this.isDragging || !this.thumbnailsContainer) return;
		e.preventDefault();
		const el = this.thumbnailsContainer.nativeElement;
		const y = e.pageY - el.offsetTop;
		const walk = (y - this.startY) * 2;
		el.scrollTop = this.scrollTop - walk;
	}
}
