import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
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
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
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

  it('should create', () => {
    mockDataService.getProductById.mockReturnValue(of(null));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to 404 if product is not found', () => {
    mockDataService.getProductById.mockReturnValue(of(null));
    fixture.detectChanges(); // calls ngOnInit

    expect(router.navigate).toHaveBeenCalledWith(['/404'], { replaceUrl: true });
    expect(component.isLoading()).toBe(false);
  });

  it('should set product and track view item when product is found', () => {
    const mockProduct: Partial<IProduct> = {
      sId: '123',
      sNameProduct: 'Test Product',
      sDescription: 'Test Description that is quite long enough to pass.',
      aImages: ['image1.jpg']
    };
    mockDataService.getProductById.mockReturnValue(of(mockProduct));

    fixture.detectChanges(); // calls ngOnInit

    expect(component.product()?.sId).toBe('123');
    expect(mockSeoService.setSeoData).toHaveBeenCalledWith('Test Product', 'Test Description that is quite long enough to pass.');
    expect(mockSeoService.addJsonLd).toHaveBeenCalled();
    expect(mockAnalyticsService.trackViewItem).toHaveBeenCalled();
    expect(component.mainImage()).toBe('image1.jpg');
    expect(component.isLoading()).toBe(false);
  });
});
