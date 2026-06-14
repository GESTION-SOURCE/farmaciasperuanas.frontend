import { Component, inject, OnInit, signal } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CartService } from '../../../../core/services/cart.service';
import { IProduct } from '../../../../core/interfaces/IProduct.interface';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardSkeletonComponent } from './components/product-card-skeleton/product-card-skeleton.component';

@Component({
	selector: 'app-product-list',
	standalone: true,
	imports: [ProductCardComponent, ProductCardSkeletonComponent, MatButtonModule],
	templateUrl: './product-list.html',
	styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
	private mockDataService = inject(MockDataService);
	private cartService = inject(CartService);

	readonly products = signal<IProduct[]>([]);
	readonly isLoading = signal(true);
	readonly hasError = signal(false);

	ngOnInit(): void {
		this.loadProducts();
	}

	loadProducts(): void {
		this.isLoading.set(true);
		this.hasError.set(false);

		this.mockDataService.getProducts().subscribe({
			next: (data) => {
				this.products.set(data);
				this.isLoading.set(false);
			},
			error: () => {
				this.hasError.set(true);
				this.isLoading.set(false);
			}
		});
	}

	onAddToCart(event: { product: IProduct; variant: any }): void {
		this.cartService.addToCart(event.product, event.variant, 1);
	}
}