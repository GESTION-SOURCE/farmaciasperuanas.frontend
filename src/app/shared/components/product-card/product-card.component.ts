import { Component, Input, Output, EventEmitter, signal, OnInit, inject } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { IProduct, IVariant } from '../../../core/interfaces/IProduct.interface';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DiscountTagComponent } from '../discount-tag/discount-tag';
import { FavoriteSnackbarComponent } from '../favorite-snackbar/favorite-snackbar.component';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [DecimalPipe, UpperCasePipe, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, DiscountTagComponent],
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
	@Input({ required: true }) product!: IProduct;
	@Output() addToCart = new EventEmitter<{ product: IProduct, variant: IVariant }>();

	private snackBar = inject(MatSnackBar);

	selectedVariant = signal<IVariant | null>(null);
	isFavorite = signal(false);
	isAnimating = signal(false);
	isImageLoading = signal(true);
	private imageLoadTimeout: any;

	ngOnInit() {
		if (this.product.aVariants && this.product.aVariants.length > 0) {
			this.selectedVariant.set(this.product.aVariants[0]);
		}
	}

	selectVariant(variant: IVariant, event: Event) {
		event.stopPropagation();
		event.preventDefault();
		if (this.selectedVariant()?.sId !== variant.sId) {
			this.isImageLoading.set(true);
			clearTimeout(this.imageLoadTimeout);
			this.selectedVariant.set(variant);
		}
	}

	onImageLoad() {
		// Minimum delay to guarantee the animation is visible, providing a premium feel.
		this.imageLoadTimeout = setTimeout(() => {
			this.isImageLoading.set(false);
		}, 350);
	}

	onAddToCart(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		const variant = this.selectedVariant();
		if (variant) {
			this.addToCart.emit({ product: this.product, variant });
		}
	}

	toggleFavorite(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		this.isFavorite.update(v => !v);
		this.isAnimating.set(true);
		setTimeout(() => this.isAnimating.set(false), 600);

		this.snackBar.openFromComponent(FavoriteSnackbarComponent, {
			data: {
				productName: this.product.sNameProduct,
				added: this.isFavorite()
			},
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: ['favorite-snackbar-panel']
		});
	}
}
