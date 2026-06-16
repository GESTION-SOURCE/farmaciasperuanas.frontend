import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
	selector: 'app-cart-sidebar',
	standalone: true,
	imports: [CommonModule, DecimalPipe],
	templateUrl: './cart-sidebar.html',
	styleUrl: './cart-sidebar.scss'
})
export class CartSidebarComponent {
	public cartService = inject(CartService);

	closeSidebar(): void {
		this.cartService.closeSidebar();
	}

	removeItem(sItemId: string): void {
		this.cartService.removeFromCart(sItemId);
	}

	updateQuantity(sItemId: string, nQuantity: number): void {
		this.cartService.updateQuantity(sItemId, nQuantity);
	}
}
