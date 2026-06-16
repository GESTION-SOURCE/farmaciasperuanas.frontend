import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { RouterModule } from '@angular/router';
import { IProduct, IVariant } from '../../../core/interfaces/IProduct.interface';

describe('@ProductCardComponent', () => {
	let component: ProductCardComponent;
	let fixture: ComponentFixture<ProductCardComponent>;

	const mockProduct: IProduct = {
		sId: '1',
		sSku: 'SKU1',
		sNameProduct: 'Test Product',
		sBrand: 'Brand',
		sDescription: 'Desc',
		sLongDescription: 'Long Desc',
		sComposition: 'Comp',
		sContraindications: 'Contra',
		aImages: [],
		aThumbnails: [],
		nRegularPrice: 10,
		nPromotionalPrice: 8,
		aVariants: [
			{ sId: 'v1', sName: 'Variant 1', nPrice: 10, sImage: 'img.jpg' }
		]
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProductCardComponent, RouterModule.forRoot([])]
		}).compileComponents();

		fixture = TestBed.createComponent(ProductCardComponent);
		component = fixture.componentInstance;
	});

	it('#Should emit addToCart When onAddToCart is called', () => {
		// Arrange
		fixture.componentRef.setInput('product', mockProduct);
		fixture.detectChanges();
		const eventSpy = vi.spyOn(component.addToCart, 'emit');
		const mockEvent = new Event('click');
		mockEvent.stopPropagation = vi.fn();
		mockEvent.preventDefault = vi.fn();

		// Act
		component.onAddToCart(mockEvent);

		// Assert
		expect(eventSpy).toHaveBeenCalledWith({ product: mockProduct, variant: mockProduct.aVariants![0] });
	});

	it('#Should update selectedVariant When selectVariant is called', () => {
		// Arrange
		fixture.componentRef.setInput('product', mockProduct);
		fixture.detectChanges();
		const newVariant: IVariant = { sId: 'v2', sName: 'V2', nPrice: 12, sImage: 'img2.jpg' };
		const mockEvent = new Event('click');
		mockEvent.stopPropagation = vi.fn();
		mockEvent.preventDefault = vi.fn();

		// Act
		component.selectVariant(newVariant, mockEvent);

		// Assert
		expect(component.selectedVariant()?.sId).toBe('v2');
	});
});
