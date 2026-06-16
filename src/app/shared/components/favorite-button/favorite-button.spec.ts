import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';
import { FavoriteButton } from './favorite-button';
import { FavoriteSnackbarComponent } from '../favorite-snackbar/favorite-snackbar.component';

describe('FavoriteButton', () => {
	let component: FavoriteButton;
	let fixture: ComponentFixture<FavoriteButton>;
	let snackBar: MatSnackBar;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FavoriteButton]
		}).compileComponents();

		fixture = TestBed.createComponent(FavoriteButton);
		component = fixture.componentInstance;
		component.productName = 'Test Product';

		snackBar = component['snackBar'] as MatSnackBar;
		vi.spyOn(snackBar, 'openFromComponent').mockReturnValue({} as any);

		fixture.detectChanges();
	});

	it('#Should create When instantiated', () => {
		expect(component).toBeTruthy();
	});

	describe('Toggle Favorite Interactions', () => {
		let event: Event;

		beforeEach(() => {
			event = new Event('click');
			vi.spyOn(event, 'stopPropagation');
			vi.spyOn(event, 'preventDefault');
		});

		it('#Should set isFavorite to true When button is clicked initially', () => {
			component.toggleFavorite(event);
			expect(component.isFavorite()).toBe(true);
		});

		it('#Should call openFromComponent on snackBar When button is clicked', () => {
			component.toggleFavorite(event);
			expect(snackBar.openFromComponent).toHaveBeenCalledWith(FavoriteSnackbarComponent, expect.objectContaining({
				data: { productName: 'Test Product', added: true },
				duration: 3000
			}));
		});

		it('#Should set isAnimating to false after timeout When button is clicked', () => {
			vi.useFakeTimers();
			component.toggleFavorite(event);
			vi.advanceTimersByTime(600);
			expect(component.isAnimating()).toBe(false);
			vi.useRealTimers();
		});

		it('#Should open snackbar with default product name When productName is empty', () => {
			component.productName = '';
			component.toggleFavorite(event);
			expect(snackBar.openFromComponent).toHaveBeenCalledWith(FavoriteSnackbarComponent, expect.objectContaining({
				data: { productName: 'Producto', added: true }
			}));
		});
	});
});