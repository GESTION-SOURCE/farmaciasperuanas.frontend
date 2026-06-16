import { Component, ElementRef, ViewChild, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../../../../core/interfaces/IProduct.interface';
import { ProductCardComponent } from '../../../../../../shared/components/product-card/product-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../../../../core/services/cart.service';
import { AnalyticsService } from '../../../../../../core/services/analytics.service';

@Component({
	selector: 'app-most-searched-products',
	standalone: true,
	imports: [CommonModule, ProductCardComponent, MatButtonModule, MatIconModule],
	templateUrl: './most-searched-products.component.html',
	styleUrl: './most-searched-products.component.scss'
})
export class MostSearchedProductsComponent implements OnDestroy {
	@Input({ required: true }) products: IProduct[] = [];

	private cartService = inject(CartService);
	private analyticsService = inject(AnalyticsService);

	private _carousel?: ElementRef<HTMLDivElement>;

	@ViewChild('carousel') set carousel(element: ElementRef<HTMLDivElement> | undefined) {
		if (element) {
			if (!this._carousel) {
				this._carousel = element;
				this._carousel.nativeElement.addEventListener('click', (e: MouseEvent) => {
					if (this.hasDragged) {
						e.preventDefault();
						e.stopPropagation();
					}
				}, true);
				this.startAutoScroll();
			}
		} else {
			this._carousel = undefined;
			this.stopAutoScroll();
		}
	}

	get carousel(): ElementRef<HTMLDivElement> | undefined {
		return this._carousel;
	}

	ngOnDestroy() {
		this.stopAutoScroll();
	}

	autoScrollInterval: any;
	autoScrollDirection: 'right' | 'left' = 'right';

	startAutoScroll() {
		this.stopAutoScroll();
		this.autoScrollInterval = setInterval(() => {
			if (!this.carousel || this.isDragging) return;
			const el = this.carousel.nativeElement;
			
			// Si llegó al final derecho
			if (this.autoScrollDirection === 'right' && el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
				this.autoScrollDirection = 'left';
			}
			// Si llegó al inicio izquierdo
			else if (this.autoScrollDirection === 'left' && el.scrollLeft <= 10) {
				this.autoScrollDirection = 'right';
			}

			const nScrollAmount = 270;
			el.scrollBy({ left: this.autoScrollDirection === 'left' ? -nScrollAmount : nScrollAmount, behavior: 'smooth' });
		}, 3000);
	}

	stopAutoScroll() {
		if (this.autoScrollInterval) {
			clearInterval(this.autoScrollInterval);
			this.autoScrollInterval = undefined;
		}
	}

	onMouseEnter() {
		this.stopAutoScroll();
	}

	onAddToCart(event: { product: IProduct; variant: any }): void {
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

	isDragging = false;
	hasDragged = false;
	startX = 0;
	scrollLeft = 0;

	onMouseDown(e: MouseEvent): void {
		if (!this.carousel) return;
		this.isDragging = true;
		this.hasDragged = false;
		const el = this.carousel.nativeElement;
		this.startX = e.pageX - el.offsetLeft;
		this.scrollLeft = el.scrollLeft;
		el.style.cursor = 'grabbing';
		el.style.scrollSnapType = 'none'; // Disable snap while dragging for smoothness
	}

	onMouseLeave(): void {
		this.isDragging = false;
		if (this.carousel) {
			this.carousel.nativeElement.style.cursor = 'grab';
			this.carousel.nativeElement.style.scrollSnapType = 'x mandatory';
		}
		setTimeout(() => this.hasDragged = false, 50);
		this.startAutoScroll();
	}

	onMouseUp(): void {
		this.isDragging = false;
		if (this.carousel) {
			this.carousel.nativeElement.style.cursor = 'grab';
			this.carousel.nativeElement.style.scrollSnapType = 'x mandatory';
		}
		// Esperar un poquito antes de resetear el hasDragged para asegurar que el click se bloquee
		setTimeout(() => this.hasDragged = false, 50);
	}

	onMouseMove(e: MouseEvent): void {
		if (!this.isDragging || !this.carousel) return;
		e.preventDefault();
		const el = this.carousel.nativeElement;
		const x = e.pageX - el.offsetLeft;
		const walk = (x - this.startX) * 1.5; // Scroll speed multiplier
		
		// Si se movió más de 5px, se considera drag y no un clic accidental
		if (Math.abs(walk) > 5) {
			this.hasDragged = true;
		}

		el.scrollLeft = this.scrollLeft - walk;
	}

	trackById(index: number, item: IProduct): string {
		return item.sId;
	}
}
