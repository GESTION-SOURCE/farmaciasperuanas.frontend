import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { IProduct } from '../../../core/interfaces/IProduct.interface';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DiscountTagComponent } from '../discount-tag/discount-tag';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [DecimalPipe, UpperCasePipe, RouterModule, MatCardModule, MatButtonModule, MatIconModule, DiscountTagComponent],
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
	@Input({ required: true }) product!: IProduct;
	@Output() addToCart = new EventEmitter<{ product: IProduct, variant: any }>();

	isFavorite = signal(false);
	isAnimating = signal(false);

	get defaultVariant() {
		return this.product.aVariants && this.product.aVariants.length > 0
			? this.product.aVariants[0]
			: null;
	}

	onAddToCart(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		if (this.defaultVariant) {
			this.addToCart.emit({ product: this.product, variant: this.defaultVariant });
		}
	}

	toggleFavorite(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		this.isFavorite.update(v => !v);
		this.isAnimating.set(true);
		setTimeout(() => this.isAnimating.set(false), 600);
	}
}
