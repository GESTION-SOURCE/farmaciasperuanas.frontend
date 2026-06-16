import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
	let component: NotFoundComponent;
	let fixture: ComponentFixture<NotFoundComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NotFoundComponent],
			providers: [
				provideRouter([])
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NotFoundComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display the correct error title', () => {
		const titleElement = fixture.debugElement.query(By.css('.error-title')).nativeElement;
		expect(titleElement.textContent).toContain('¡Ups! Producto no encontrado');
	});

	it('should display the correct error message', () => {
		const messageElement = fixture.debugElement.query(By.css('.error-message')).nativeElement;
		expect(messageElement.textContent).toContain('no pudimos encontrar el producto o la página que estás buscando');
	});

	it('should have a button with routerLink to "/"', () => {
		const buttonElement = fixture.debugElement.query(By.css('button[routerLink="/"]'));
		expect(buttonElement).toBeTruthy();

		const buttonText = buttonElement.nativeElement.textContent;
		expect(buttonText).toContain('Volver al inicio');
	});
});
