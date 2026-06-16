import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ICartItem } from '../interfaces/ICartItem.interface';
import { IProduct, IVariant } from '../interfaces/IProduct.interface';

@Injectable({
	providedIn: 'root'
})
export class CartService {
	private readonly CART_STORAGE_KEY = 'ecommerce_cart';

	// Reactive state using Angular Signals
	private cartItemsSignal = signal<ICartItem[]>([]);
	public isSidebarOpen = signal<boolean>(false);

	// Computed signals for UI
	public cartItems = this.cartItemsSignal.asReadonly();
	public totalItems = computed(() =>
		this.cartItemsSignal().reduce((total, item) => total + item.nQuantity, 0)
	);
	public totalPrice = computed(() =>
		this.cartItemsSignal().reduce((total, item) => total + (item.oVariant.nPrice * item.nQuantity), 0)
	);

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		if (isPlatformBrowser(this.platformId)) {
			this.cartItemsSignal.set(this.loadCartFromStorage());
		}
	}

	addToCart(product: IProduct, variant: IVariant, nQuantity: number = 1): void {
		const currentItems = this.cartItemsSignal();
		const sItemId = `${product.sId}_${variant.sId}`;

		const existingItemIndex = currentItems.findIndex(item => item.sId === sItemId);

		let newItems: ICartItem[];
		if (existingItemIndex > -1) {
			newItems = currentItems.map((item, index) => {
				if (index === existingItemIndex) {
					return { ...item, nQuantity: item.nQuantity + nQuantity };
				}
				return item;
			});
		} else {
			newItems = [...currentItems, { sId: sItemId, oProduct: product, oVariant: variant, nQuantity }];
		}

		this.updateCart(newItems);
		this.openSidebar(); // Auto open sidebar when adding item
	}

	removeFromCart(sItemId: string): void {
		const currentItems = this.cartItemsSignal();
		const newItems = currentItems.filter(item => item.sId !== sItemId);
		this.updateCart(newItems);
	}

	updateQuantity(sItemId: string, nQuantity: number): void {
		if (nQuantity <= 0) {
			this.removeFromCart(sItemId);
			return;
		}

		const currentItems = this.cartItemsSignal();
		const newItems = currentItems.map(item =>
			item.sId === sItemId ? { ...item, nQuantity } : item
		);
		this.updateCart(newItems);
	}

	clearCart(): void {
		this.updateCart([]);
	}

	toggleSidebar(): void {
		this.isSidebarOpen.update(v => !v);
	}

	openSidebar(): void {
		this.isSidebarOpen.set(true);
	}

	closeSidebar(): void {
		this.isSidebarOpen.set(false);
	}

	private updateCart(items: ICartItem[]): void {
		this.cartItemsSignal.set(items);
		if (isPlatformBrowser(this.platformId)) {
			this.saveCartToStorage(items);
		}
	}

	private loadCartFromStorage(): ICartItem[] {
		try {
			const stored = localStorage.getItem(this.CART_STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch (e) {
			console.error('Error parsing cart from localStorage', e);
			return [];
		}
	}

	private saveCartToStorage(items: ICartItem[]): void {
		localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
	}
}
