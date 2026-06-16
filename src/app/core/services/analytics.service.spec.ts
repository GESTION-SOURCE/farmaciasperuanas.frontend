import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { PLATFORM_ID } from '@angular/core';
import { IProduct, IVariant } from '../interfaces/IProduct.interface';

describe('@AnalyticsService', () => {
	let service: AnalyticsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AnalyticsService,
				{ provide: PLATFORM_ID, useValue: 'browser' }
			]
		});
		service = TestBed.inject(AnalyticsService);
		window.dataLayer = [];
	});

	it('#Should push exact payload details for view_item When trackViewItem is called', () => {
		// Arrange
		const mockProduct = { sSku: '123', sNameProduct: 'Test Product', nRegularPrice: 99.9, sBrand: 'TestBrand' } as IProduct;
		window.dataLayer = [];

		// Act
		service.trackViewItem(mockProduct);

		// Assert
		expect(window.dataLayer[0]).toEqual({
			event: 'view_item',
			ecommerce: {
				items: [{
					item_id: '123',
					item_name: 'Test Product',
					price: 99.9,
					item_brand: 'TestBrand',
					item_category: 'Farmacia'
				}]
			}
		});
	});

	it('#Should push exact payload details for add_to_cart When trackAddToCart is called', () => {
		// Arrange
		const mockProduct = { sSku: '123', sNameProduct: 'Test Product', sBrand: 'TestBrand' } as IProduct;
		const mockVariant = { sName: 'Variant A', nPrice: 50 } as IVariant;
		window.dataLayer = [];

		// Act
		service.trackAddToCart(mockProduct, mockVariant, 2);

		// Assert
		expect(window.dataLayer[0]).toEqual({
			event: 'add_to_cart',
			ecommerce: {
				items: [{
					item_id: '123',
					item_name: 'Test Product',
					price: 50,
					item_brand: 'TestBrand',
					item_variant: 'Variant A',
					quantity: 2
				}]
			}
		});
	});
});
