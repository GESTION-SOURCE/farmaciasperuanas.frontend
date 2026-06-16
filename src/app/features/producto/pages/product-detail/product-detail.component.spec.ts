import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CartService } from '../../../../core/services/cart.service';
import { SeoService } from '../../../../core/services/seo.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { IProduct } from '../../../../core/interfaces/IProduct.interface';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockDataService: any;
  let mockCartService: any;
  let mockSeoService: any;
  let mockAnalyticsService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      paramMap: of({ get: (key: string) => '123' })
    };

    mockDataService = {
      getProductById: jasmine.createSpy('getProductById').and.returnValue(of(null)),
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of([]))
    };

    mockCartService = {
      addToCart: jasmine.createSpy('addToCart')
    };

    mockSeoService = {
      setSeoData: jasmine.createSpy('setSeoData'),
      addJsonLd: jasmine.createSpy('addJsonLd')
    };

    mockAnalyticsService = {
      trackViewItem: jasmine.createSpy('trackViewItem'),
      trackAddToCart: jasmine.createSpy('trackAddToCart')
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MockDataService, useValue: mockDataService },
        { provide: CartService, useValue: mockCartService },
        { provide: SeoService, useValue: mockSeoService },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockDataService.getProductById.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to 404 if product is not found', () => {
    mockDataService.getProductById.and.returnValue(of(null));
    fixture.detectChanges(); // calls ngOnInit
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404'], { replaceUrl: true });
    expect(component.isLoading()).toBeFalse();
  });

  it('should set product and track view item when product is found', () => {
    const mockProduct: Partial<IProduct> = {
      sId: '123',
      sNameProduct: 'Test Product',
      sDescription: 'Test Description that is quite long enough to pass.',
      aImages: ['image1.jpg']
    };
    mockDataService.getProductById.and.returnValue(of(mockProduct));
    
    fixture.detectChanges(); // calls ngOnInit

    expect(component.product()?.sId).toBe('123');
    expect(mockSeoService.setSeoData).toHaveBeenCalledWith('Test Product', 'Test Description that is quite long enough to pass.');
    expect(mockSeoService.addJsonLd).toHaveBeenCalled();
    expect(mockAnalyticsService.trackViewItem).toHaveBeenCalled();
    expect(component.mainImage()).toBe('image1.jpg');
    expect(component.isLoading()).toBeFalse();
  });
});
