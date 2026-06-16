import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteSnackbarComponent, IFavoriteSnackData } from './favorite-snackbar.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('@FavoriteSnackbarComponent', () => {
	let component: FavoriteSnackbarComponent;
	let fixture: ComponentFixture<FavoriteSnackbarComponent>;
	let snackBarRefSpy: any;

	beforeEach(async () => {
		snackBarRefSpy = { dismiss: vi.fn() };

		await TestBed.configureTestingModule({
			imports: [FavoriteSnackbarComponent],
			providers: [
				{ provide: MAT_SNACK_BAR_DATA, useValue: { productName: 'Prod', added: true } },
				{ provide: MatSnackBarRef, useValue: snackBarRefSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(FavoriteSnackbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should call dismiss on snackBarRef When dismiss is executed', () => {
		// Arrange
		// Act
		component.dismiss();

		// Assert
		expect(snackBarRefSpy.dismiss).toHaveBeenCalled();
	});

	it('#Should display correct message When added is true', () => {
		// Arrange
		// Act
		const titleElement = fixture.nativeElement.querySelector('.toast-title');

		// Assert
		expect(titleElement.textContent.trim()).toBe('¡Añadido a favoritos!');
	});
});
