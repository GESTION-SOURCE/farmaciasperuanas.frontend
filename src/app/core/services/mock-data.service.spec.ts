import { TestBed } from '@angular/core/testing';
import { MockDataService } from './mock-data.service';
import { firstValueFrom } from 'rxjs';

describe('@MockDataService', () => {
	let service: MockDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [MockDataService]
		});
		service = TestBed.inject(MockDataService);
	});

	it('#Should return product array When getProducts is called', async () => {
		// Arrange
		// Act
		const result = await firstValueFrom(service.getProducts());

		// Assert
		expect(result.length).toBeGreaterThan(0);
	});

	it('#Should return specific product When getProductById is called with valid id', async () => {
		// Arrange
		// Act
		const result = await firstValueFrom(service.getProductById('1'));

		// Assert
		expect(result?.sId).toBe('1');
	});

	it('#Should return cross-selling products When getProducts is called for cross-selling', async () => {
		// Arrange
		// Act
		const result = await firstValueFrom(service.getProducts());

		// Assert
		expect(result?.length).toBeGreaterThan(0);
	});
});
