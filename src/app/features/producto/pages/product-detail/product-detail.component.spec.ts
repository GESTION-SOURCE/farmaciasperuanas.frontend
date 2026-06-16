import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CartService } from '../../../../core/services/cart.service';
import { SeoService } from '../../../../core/services/seo.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { IProduct } from '../../../../core/interfaces/IProduct.interface';

describe('ProductDetailComponent', () => {
	let component: ProductDetailComponent;
	let fixture: ComponentFixture<ProductDetailComponent>;
	let router: Router;
	let mockActivatedRoute: any;
	let mockDataService: any;
	let mockCartService: any;
	let mockSeoService: any;
	let mockAnalyticsService: any;
	let mockProduct: Partial<IProduct>;

	beforeEach(async () => {
		mockActivatedRoute = {
			paramMap: of({ get: (key: string) => '123' })
		};

		mockDataService = {
			getProductById: vi.fn().mockReturnValue(of(null)),
			getProducts: vi.fn().mockReturnValue(of([]))
		};

		mockCartService = {
			addToCart: vi.fn()
		};

		mockSeoService = {
			setSeoData: vi.fn(),
			addJsonLd: vi.fn()
		};

		mockAnalyticsService = {
			trackViewItem: vi.fn(),
			trackAddToCart: vi.fn()
		};

		await TestBed.configureTestingModule({
			imports: [ProductDetailComponent, RouterModule.forRoot([])],
			providers: [
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: MockDataService, useValue: mockDataService },
				{ provide: CartService, useValue: mockCartService },
				{ provide: SeoService, useValue: mockSeoService },
				{ provide: AnalyticsService, useValue: mockAnalyticsService }
			]
		}).compileComponents();

		router = TestBed.inject(Router);
		vi.spyOn(router, 'navigate');

		fixture = TestBed.createComponent(ProductDetailComponent);
		component = fixture.componentInstance;
	});

	describe('Initialization without product', () => {
		it('#Should create the component When instantiated', () => {
			mockDataService.getProductById.mockReturnValue(of(null));
			fixture.detectChanges();
			expect(component).toBeTruthy();
		});

		it('#Should navigate to 404 When product is not found', () => {
			mockDataService.getProductById.mockReturnValue(of(null));
			fixture.detectChanges();
			expect(router.navigate).toHaveBeenCalledWith(['/404'], { replaceUrl: true });
		});

		it('#Should set isLoading to false When product is not found', () => {
			mockDataService.getProductById.mockReturnValue(of(null));
			fixture.detectChanges();
			expect(component.isLoading()).toBe(false);
		});
	});

	describe('Initialization with product', () => {
		beforeEach(() => {
			mockProduct = {
				sId: '123',
				sNameProduct: 'Test Product',
				sDescription: 'Test Description that is quite long enough to pass.',
				aImages: ['image1.jpg'],
				aVariants: []
			};
			mockDataService.getProductById.mockReturnValue(of(mockProduct));
			fixture.detectChanges();
		});

		it('#Should set product When product is found', () => {
			expect(component.product()?.sId).toBe('123');
		});

		it('#Should call setSeoData When product is found', () => {
			expect(mockSeoService.setSeoData).toHaveBeenCalledWith('Test Product', 'Test Description that is quite long enough to pass.');
		});

		it('#Should call addJsonLd When product is found', () => {
			expect(mockSeoService.addJsonLd).toHaveBeenCalled();
		});

		it('#Should track view item When product is found', () => {
			expect(mockAnalyticsService.trackViewItem).toHaveBeenCalled();
		});

		it('#Should set main image When product is found', () => {
			expect(component.mainImage()).toBe('image1.jpg');
		});

		it('#Should set isLoading to false When product is found', () => {
			expect(component.isLoading()).toBe(false);
		});
	});

	describe('Interactions', () => {
		beforeEach(() => {
			mockProduct = {
				sId: '123',
				sNameProduct: 'Test Product',
				sDescription: 'Desc',
				aImages: ['image1.jpg', 'image2.jpg'],
				aVariants: [
					{ sId: 'v1', sName: 'Variant 1', nPrice: 10, sImage: 'v1.jpg' },
					{ sId: 'v2', sName: 'Variant 2', nPrice: 20, sImage: 'v2.jpg' }
				]
			};
			mockDataService.getProductById.mockReturnValue(of(mockProduct));
			fixture.detectChanges();
		});

		it('#Should set selected variant When selectVariant is called', () => {
			const variant = { sId: 'v2', sName: 'Variant 2', nPrice: 20, sImage: 'v2.jpg' };
			component.selectVariant(variant);
			expect(component.selectedVariant()?.sId).toBe('v2');
		});

		it('#Should set main image When selectVariant is called', () => {
			const variant = { sId: 'v2', sName: 'Variant 2', nPrice: 20, sImage: 'v2.jpg' };
			component.selectVariant(variant);
			expect(component.mainImage()).toBe('v2.jpg');
		});

		it('#Should set main image When setMainImage is called', () => {
			component.setMainImage('test.jpg');
			expect(component.mainImage()).toBe('test.jpg');
		});

		it('#Should expand description When toggleDescription is called initially', () => {
			component.toggleDescription();
			expect(component.isDescriptionExpanded()).toBe(true);
		});

		it('#Should call addToCart on cartService When addToCart is called', () => {
			component.addToCart(component.product() as IProduct);
			expect(mockCartService.addToCart).toHaveBeenCalled();
		});

		it('#Should track addToCart on analyticsService When addToCart is called', () => {
			component.addToCart(component.product() as IProduct);
			expect(mockAnalyticsService.trackAddToCart).toHaveBeenCalled();
		});

		it('#Should set isZoomed to true When onMouseMove is called', () => {
			const event = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
			Object.defineProperty(event, 'currentTarget', { value: document.createElement('div') });
			component.onMouseMove(event);
			expect(component.isZoomed()).toBe(true);
		});

		it('#Should set isZoomed to false When onMouseLeave is called', () => {
			component.isZoomed.set(true);
			component.onMouseLeave();
			expect(component.isZoomed()).toBe(false);
		});

		it('#Should reset zoomOrigin When onMouseLeave is called', () => {
			component.isZoomed.set(true);
			component.onMouseLeave();
			expect(component.zoomOrigin()).toBe('center center');
		});

		it('#Should scroll thumbnails up When scrollThumbnails is called with up', () => {
			const mockEl = { scrollBy: vi.fn() };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			component.scrollThumbnails('up');
			expect(mockEl.scrollBy).toHaveBeenCalledWith({ top: -80, behavior: 'smooth' });
		});

		it('#Should scroll thumbnails down When scrollThumbnails is called with down', () => {
			const mockEl = { scrollBy: vi.fn() };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			component.scrollThumbnails('down');
			expect(mockEl.scrollBy).toHaveBeenCalledWith({ top: 80, behavior: 'smooth' });
		});

		it('#Should stop propagation When toggleFavorite is called', () => {
			const event = new Event('click');
			vi.spyOn(event, 'stopPropagation');
			component.toggleFavorite(event);
			expect(event.stopPropagation).toHaveBeenCalled();
		});

		it('#Should set isFavorite to true When toggleFavorite is called initially', () => {
			const event = new Event('click');
			component.toggleFavorite(event);
			expect(component.isFavorite()).toBe(true);
		});

		it('#Should set isDragging to true When onThumbnailsMouseDown is called', () => {
			const mockEl = { offsetTop: 10, scrollTop: 20, style: { cursor: '' } };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			const mouseDownEvent = new MouseEvent('mousedown', { clientY: 50 });
			Object.defineProperty(mouseDownEvent, 'pageY', { value: 50 });
			
			component.onThumbnailsMouseDown(mouseDownEvent);
			expect(component.isDragging).toBe(true);
		});

		it('#Should set cursor to grabbing When onThumbnailsMouseDown is called', () => {
			const mockEl = { offsetTop: 10, scrollTop: 20, style: { cursor: '' } };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			const mouseDownEvent = new MouseEvent('mousedown', { clientY: 50 });
			Object.defineProperty(mouseDownEvent, 'pageY', { value: 50 });
			
			component.onThumbnailsMouseDown(mouseDownEvent);
			expect(mockEl.style.cursor).toBe('grabbing');
		});

		it('#Should set isDragging to false When onThumbnailsMouseLeave is called', () => {
			const mockEl = { offsetTop: 10, scrollTop: 20, style: { cursor: '' } };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			component.isDragging = true;
			
			component.onThumbnailsMouseLeave();
			expect(component.isDragging).toBe(false);
		});

		it('#Should set isDragging to false When onThumbnailsMouseUp is called', () => {
			const mockEl = { offsetTop: 10, scrollTop: 20, style: { cursor: '' } };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			component.isDragging = true;
			
			component.onThumbnailsMouseUp();
			expect(component.isDragging).toBe(false);
		});

		it('#Should reset cursor to grab When onThumbnailsMouseUp is called', () => {
			const mockEl = { offsetTop: 10, scrollTop: 20, style: { cursor: '' } };
			component.thumbnailsContainer = { nativeElement: mockEl } as any;
			component.isDragging = true;
			
			component.onThumbnailsMouseUp();
			expect(mockEl.style.cursor).toBe('grab');
		});
	});
});
