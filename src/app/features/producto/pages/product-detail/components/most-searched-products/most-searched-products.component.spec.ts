import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { MostSearchedProductsComponent } from './most-searched-products.component';
import { CartService } from '../../../../../../core/services/cart.service';
import { AnalyticsService } from '../../../../../../core/services/analytics.service';
import { IProduct } from '../../../../../../core/interfaces/IProduct.interface';

describe('MostSearchedProductsComponent', () => {
	let component: MostSearchedProductsComponent;
	let fixture: ComponentFixture<MostSearchedProductsComponent>;
	let mockCartService: any;
	let mockAnalyticsService: any;

	beforeEach(async () => {
		mockCartService = { addToCart: vi.fn() };
		mockAnalyticsService = { trackAddToCart: vi.fn() };

		await TestBed.configureTestingModule({
			imports: [MostSearchedProductsComponent],
			providers: [
				provideRouter([]),
				{ provide: CartService, useValue: mockCartService },
				{ provide: AnalyticsService, useValue: mockAnalyticsService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(MostSearchedProductsComponent);
		component = fixture.componentInstance;
		component.products = [
			{ sId: '1', sNameProduct: 'P1' } as IProduct,
			{ sId: '2', sNameProduct: 'P2' } as IProduct
		];
	});

	it('#Should create When instantiated', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('AutoScroll Initializer', () => {
		let mockEl: HTMLElement;
		let elRef: ElementRef;

		beforeEach(() => {
			mockEl = document.createElement('div');
			elRef = new ElementRef(mockEl);
			vi.spyOn(component, 'startAutoScroll');
		});

		it('#Should set carousel When carousel input is set', () => {
			component.carousel = elRef;
			expect(component.carousel).toBe(elRef);
		});

		it('#Should call startAutoScroll When carousel input is set', () => {
			component.carousel = elRef;
			expect(component.startAutoScroll).toHaveBeenCalled();
		});

		it('#Should call stopAutoScroll When carousel input is cleared', () => {
			vi.spyOn(component, 'stopAutoScroll');
			component.carousel = undefined;
			expect(component.stopAutoScroll).toHaveBeenCalled();
		});
	});

	describe('AddToCart Interaction', () => {
		let mockEvent: any;

		beforeEach(() => {
			mockEvent = { product: component.products[0], variant: {} as any };
		});

		it('#Should call addToCart on cartService When onAddToCart is called', () => {
			component.onAddToCart(mockEvent);
			expect(mockCartService.addToCart).toHaveBeenCalledWith(mockEvent.product, mockEvent.variant, 1);
		});

		it('#Should call trackAddToCart on analyticsService When onAddToCart is called', () => {
			component.onAddToCart(mockEvent);
			expect(mockAnalyticsService.trackAddToCart).toHaveBeenCalledWith(mockEvent.product, mockEvent.variant, 1);
		});
	});

	describe('Carousel Navigation', () => {
		let mockEl: any;

		beforeEach(() => {
			mockEl = { scrollBy: vi.fn(), addEventListener: vi.fn() };
			component.carousel = new ElementRef(mockEl);
		});

		it('#Should scroll left by 270 When scrollCarousel is called with left', () => {
			component.scrollCarousel('left');
			expect(mockEl.scrollBy).toHaveBeenCalledWith({ left: -270, behavior: 'smooth' });
		});

		it('#Should scroll right by 270 When scrollCarousel is called with right', () => {
			component.scrollCarousel('right');
			expect(mockEl.scrollBy).toHaveBeenCalledWith({ left: 270, behavior: 'smooth' });
		});

		it('#Should call stopAutoScroll When onMouseEnter is called', () => {
			vi.spyOn(component, 'stopAutoScroll');
			component.onMouseEnter();
			expect(component.stopAutoScroll).toHaveBeenCalled();
		});
	});

	describe('Dragging Interactions', () => {
		let mockEl: any;
		let mouseDown: MouseEvent;
		let mouseMove: MouseEvent;

		beforeEach(() => {
			mockEl = { offsetLeft: 10, scrollLeft: 20, style: { cursor: '', scrollSnapType: '' }, addEventListener: vi.fn() };
			component.carousel = new ElementRef(mockEl);
			
			mouseDown = new MouseEvent('mousedown', { clientX: 50 });
			Object.defineProperty(mouseDown, 'pageX', { value: 50 });
			
			mouseMove = new MouseEvent('mousemove', { clientX: 60 });
			Object.defineProperty(mouseMove, 'pageX', { value: 60 });
		});

		it('#Should set isDragging to true When onMouseDown is called', () => {
			component.onMouseDown(mouseDown);
			expect(component.isDragging).toBe(true);
		});

		it('#Should set hasDragged to false When onMouseDown is called', () => {
			component.onMouseDown(mouseDown);
			expect(component.hasDragged).toBe(false);
		});

		it('#Should change cursor to grabbing When onMouseDown is called', () => {
			component.onMouseDown(mouseDown);
			expect(mockEl.style.cursor).toBe('grabbing');
		});

		it('#Should set hasDragged to true When onMouseMove is called after mousedown', () => {
			component.onMouseDown(mouseDown);
			component.onMouseMove(mouseMove);
			expect(component.hasDragged).toBe(true);
		});

		it('#Should set isDragging to false When onMouseUp is called', () => {
			component.onMouseDown(mouseDown);
			component.onMouseUp();
			expect(component.isDragging).toBe(false);
		});

		it('#Should change cursor to grab When onMouseUp is called', () => {
			component.onMouseDown(mouseDown);
			component.onMouseUp();
			expect(mockEl.style.cursor).toBe('grab');
		});

		it('#Should set isDragging to false When onMouseLeave is called', () => {
			component.onMouseDown(mouseDown);
			component.onMouseLeave();
			expect(component.isDragging).toBe(false);
		});
	});

	describe('Other Functions', () => {
		it('#Should return product sId When trackById is called', () => {
			expect(component.trackById(0, component.products[0])).toBe('1');
		});
	});

	describe('Autoscroll Interval Boundaries', () => {
		let mockEl: any;

		beforeEach(() => {
			vi.useFakeTimers();
			mockEl = { scrollLeft: 100, clientWidth: 100, scrollWidth: 200, scrollBy: vi.fn(), addEventListener: vi.fn() };
			component.carousel = new ElementRef(mockEl);
		});

		afterEach(() => {
			component.stopAutoScroll();
			vi.useRealTimers();
		});

		it('#Should change direction to left When reached right boundary', () => {
			component.autoScrollDirection = 'right';
			component.startAutoScroll();
			vi.advanceTimersByTime(3000);
			expect(component.autoScrollDirection).toBe('left');
		});

		it('#Should call scrollBy left When reached right boundary', () => {
			component.autoScrollDirection = 'right';
			component.startAutoScroll();
			vi.advanceTimersByTime(3000);
			expect(mockEl.scrollBy).toHaveBeenCalledWith({ left: -270, behavior: 'smooth' });
		});

		it('#Should change direction to right When reached left boundary', () => {
			component.autoScrollDirection = 'left';
			mockEl.scrollLeft = 5;
			component.startAutoScroll();
			vi.advanceTimersByTime(3000);
			expect(component.autoScrollDirection).toBe('right');
		});
	});
});