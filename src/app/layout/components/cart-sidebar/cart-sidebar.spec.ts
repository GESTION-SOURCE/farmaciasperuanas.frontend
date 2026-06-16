import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CartSidebarComponent } from './cart-sidebar';
import { CartService } from '../../../core/services/cart.service';

describe('@CartSidebarComponent', () => {
	let component: CartSidebarComponent;
	let fixture: ComponentFixture<CartSidebarComponent>;
	let cartServiceSpy: any;

	beforeEach(async () => {
		cartServiceSpy = {
			closeSidebar: vi.fn(),
			removeFromCart: vi.fn(),
			updateQuantity: vi.fn(),
			isSidebarOpen: signal(false),
			cartItems: signal([]),
			totalItems: signal(0),
			totalPrice: signal(0)
		};

		await TestBed.configureTestingModule({
			imports: [CartSidebarComponent],
			providers: [
				{ provide: CartService, useValue: cartServiceSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CartSidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should create the component When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});

	it('#Should call closeSidebar When closeSidebar is executed', () => {
		// Arrange
		// Act
		component.closeSidebar();

		// Assert
		expect(cartServiceSpy.closeSidebar).toHaveBeenCalled();
	});

	it('#Should call removeFromCart When removeItem is executed', () => {
		// Arrange
		const itemId = '1_v1';

		// Act
		component.removeItem(itemId);

		// Assert
		expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(itemId);
	});

	it('#Should call updateQuantity When updateQuantity is executed', () => {
		// Arrange
		const itemId = '1_v1';
		const quantity = 5;

		// Act
		component.updateQuantity(itemId, quantity);

		// Assert
		expect(cartServiceSpy.updateQuantity).toHaveBeenCalledWith(itemId, quantity);
	});
});
