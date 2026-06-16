import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('@Footer', () => {
	let component: Footer;
	let fixture: ComponentFixture<Footer>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Footer],
			providers: [provideRouter([])]
		}).compileComponents();

		fixture = TestBed.createComponent(Footer);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should create the footer When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});
});
