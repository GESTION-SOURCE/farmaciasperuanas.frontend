import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { RouterModule } from '@angular/router';

describe('@Navbar', () => {
	let component: Navbar;
	let fixture: ComponentFixture<Navbar>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Navbar, RouterModule.forRoot([])]
		}).compileComponents();

		fixture = TestBed.createComponent(Navbar);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should create the navbar When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});

	it('#Should toggle mobile menu flag When toggleMobileMenu is called', () => {
		// Arrange
		component.isMobileMenuOpen = false;

		// Act
		component.toggleMobileMenu();

		// Assert
		expect(component.isMobileMenuOpen).toBe(true);
	});
});
