import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { PLATFORM_ID } from '@angular/core';
import { IProduct, IVariant } from '../interfaces/IProduct.interface';

describe('@CartService', () => {
	let service: CartService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CartService,
				{ provide: PLATFORM_ID, useValue: 'browser' }
			]
		});
		
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
		vi.spyOn(Storage.prototype, 'setItem');

		service = TestBed.inject(CartService);
	});

	it('#Should add a new item to the cart When addToCart is called with a new product', () => {
		// Arrange
		const product = { sId: '1' } as IProduct;
		const variant = { sId: 'v1', nPrice: 10 } as IVariant;

		// Act
		service.addToCart(product, variant, 1);

		// Assert
		expect(service.cartItems().length).toBe(1);
	});

	it('#Should increase quantity When addToCart is called with an existing product variant', () => {
		// Arrange
		const product = { sId: '1' } as IProduct;
		const variant = { sId: 'v1', nPrice: 10 } as IVariant;
		service.addToCart(product, variant, 1);

		// Act
		service.addToCart(product, variant, 2);

		// Assert
		expect(service.cartItems()[0].nQuantity).toBe(3);
	});

	it('#Should remove the item from cart When removeFromCart is called', () => {
		// Arrange
		const product = { sId: '1' } as IProduct;
		const variant = { sId: 'v1', nPrice: 10 } as IVariant;
		service.addToCart(product, variant, 1);

		// Act
		service.removeFromCart('1_v1');

		// Assert
		expect(service.cartItems().length).toBe(0);
	});

	it('#Should update the quantity of the item When updateQuantity is called with a positive value', () => {
		// Arrange
		const product = { sId: '1' } as IProduct;
		const variant = { sId: 'v1', nPrice: 10 } as IVariant;
		service.addToCart(product, variant, 1);

		// Act
		service.updateQuantity('1_v1', 5);

		// Assert
		expect(service.cartItems()[0].nQuantity).toBe(5);
	});

	it('#Should clear all items When clearCart is called', () => {
		// Arrange
		const product = { sId: '1' } as IProduct;
		const variant = { sId: 'v1', nPrice: 10 } as IVariant;
		service.addToCart(product, variant, 1);

		// Act
		service.clearCart();

		// Assert
		expect(service.cartItems().length).toBe(0);
	});

	it('#Should correctly calculate totalItems When items are in the cart', () => {
		// Arrange
		const product1 = { sId: '1' } as IProduct;
		const variant1 = { sId: 'v1', nPrice: 10 } as IVariant;
		const product2 = { sId: '2' } as IProduct;
		const variant2 = { sId: 'v2', nPrice: 20 } as IVariant;
		service.addToCart(product1, variant1, 2);
		service.addToCart(product2, variant2, 3);

		// Act
		const total = service.totalItems();

		// Assert
		expect(total).toBe(5);
	});

	it('#Should correctly calculate totalPrice When items are in the cart', () => {
		// Arrange
		const product1 = { sId: '1' } as IProduct;
		const variant1 = { sId: 'v1', nPrice: 10 } as IVariant;
		const product2 = { sId: '2' } as IProduct;
		const variant2 = { sId: 'v2', nPrice: 20 } as IVariant;
		service.addToCart(product1, variant1, 2);
		service.addToCart(product2, variant2, 3);

		// Act
		const total = service.totalPrice();

		// Assert
		expect(total).toBe(80);
	});

	it('#Should toggle sidebar state When toggleSidebar is called', () => {
		// Arrange
		service.isSidebarOpen.set(false);

		// Act
		service.toggleSidebar();

		// Assert
		expect(service.isSidebarOpen()).toBe(true);
	});
});
