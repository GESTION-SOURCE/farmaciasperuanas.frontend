import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Navbar } from './navbar';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID, Renderer2 } from '@angular/core';

describe('@Navbar', () => {
	let component: Navbar;
	let fixture: ComponentFixture<Navbar>;
	let renderer: Renderer2;

	beforeEach(async () => {
		// Arrange
		await TestBed.configureTestingModule({
			imports: [Navbar, RouterModule.forRoot([])],
			providers: [
				{ provide: PLATFORM_ID, useValue: 'browser' },
				Renderer2
			]
		}).compileComponents();

		fixture = TestBed.createComponent(Navbar);
		component = fixture.componentInstance;
		renderer = fixture.componentRef.injector.get(Renderer2);
		fixture.detectChanges();
	});

	it('#Should create the navbar When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});

	it('#Should set isMobileMenuOpen to true When toggleMobileMenu is called initially', () => {
		// Arrange
		component.isMobileMenuOpen = false;

		// Act
		component.toggleMobileMenu();

		// Assert
		expect(component.isMobileMenuOpen).toBe(true);
	});

	it('#Should add overflow-hidden class to body When mobile menu opens', () => {
		// Arrange
		component.isMobileMenuOpen = false;

		// Act
		component.toggleMobileMenu();

		// Assert
		expect(document.body.classList.contains('overflow-hidden')).toBe(true);
	});

	it('#Should remove overflow-hidden class from body When mobile menu closes', () => {
		// Arrange
		component.isMobileMenuOpen = true;
		document.body.classList.add('overflow-hidden');

		// Act
		component.toggleMobileMenu();

		// Assert
		expect(document.body.classList.contains('overflow-hidden')).toBe(false);
	});

	it('#Should unsubscribe from scroll event When component is destroyed', () => {
		// Arrange
		const spy = vi.fn();
		component['scrollSub'] = { unsubscribe: spy } as any;

		// Act
		component.ngOnDestroy();

		// Assert
		expect(spy).toHaveBeenCalled();
	});

	it('#Should set navbarHeight and stickyNavbarHeight on browser resize When ngAfterViewInit runs', async () => {
		// Arrange
		component.navbarMain = { nativeElement: { offsetHeight: 100 } } as any;
		component.navbarWrapper = { nativeElement: { getBoundingClientRect: () => ({ top: 10 }) } } as any;
		Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });

		// Act
		component.ngAfterViewInit();
		await new Promise(r => setTimeout(r, 0));

		// Assert
		expect(component.stickyNavbarHeight).toBe(64);
	});

	it('#Should set stickyNavbarHeight to navbarHeight When window is large', async () => {
		// Arrange
		component.navbarMain = { nativeElement: { offsetHeight: 120 } } as any;
		component.navbarWrapper = { nativeElement: { getBoundingClientRect: () => ({ top: 10 }) } } as any;
		Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

		// Act
		component.ngAfterViewInit();
		await new Promise(r => setTimeout(r, 0));

		// Assert
		expect(component.stickyNavbarHeight).toBe(120);
	});

	it('#Should update isSticky When window scrolls', async () => {
		// Arrange
		component.navbarOffsetTop = 50;
		let scrollEvent = new Event('scroll');

		// Act
		component.ngAfterViewInit();
		await new Promise(r => setTimeout(r, 0));

		Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
		window.dispatchEvent(scrollEvent);
		await new Promise(r => setTimeout(r, 0));

		// Assert
		expect(component.isSticky).toBe(true);
	});
});
