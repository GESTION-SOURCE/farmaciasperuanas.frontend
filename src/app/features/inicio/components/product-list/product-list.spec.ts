import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProductListComponent } from './product-list';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CartService } from '../../../../core/services/cart.service';

describe('ProductListComponent', () => {
	let component: ProductListComponent;
	let fixture: ComponentFixture<ProductListComponent>;
	let mockDataService: any;
	let mockCartService: any;

	beforeEach(async () => {
		mockDataService = {
			getProducts: vi.fn().mockReturnValue(of([]))
		};
		mockCartService = {
			addToCart: vi.fn()
		};

		await TestBed.configureTestingModule({
			imports: [ProductListComponent],
			providers: [
				provideRouter([]),
				{ provide: MockDataService, useValue: mockDataService },
				{ provide: CartService, useValue: mockCartService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ProductListComponent);
		component = fixture.componentInstance;
	});

	it('should create and load products successfully', () => {
		const mockProducts = [{ sId: '1', sNameProduct: 'Test' }];
		mockDataService.getProducts.mockReturnValue(of(mockProducts));

		fixture.detectChanges(); // calls ngOnInit

		expect(component).toBeTruthy();
		expect(component.products()).toEqual(mockProducts);
		expect(component.isLoading()).toBe(false);
		expect(component.hasError()).toBe(false);
	});

	it('should handle error when loading products', () => {
		mockDataService.getProducts.mockReturnValue(throwError(() => new Error('Error')));

		fixture.detectChanges(); // calls ngOnInit

		expect(component.hasError()).toBe(true);
		expect(component.isLoading()).toBe(false);
		expect(component.products()).toEqual([]);
	});

	it('should add to cart', () => {
		const mockEvent = { product: {} as any, variant: {} as any };
		component.onAddToCart(mockEvent);
		expect(mockCartService.addToCart).toHaveBeenCalledWith(mockEvent.product, mockEvent.variant, 1);
	});
});
