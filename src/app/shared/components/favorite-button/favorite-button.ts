import { Component, signal, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FavoriteSnackbarComponent } from '../favorite-snackbar/favorite-snackbar.component';

@Component({
	selector: 'app-favorite-button',
	imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
	templateUrl: './favorite-button.html',
	styleUrl: './favorite-button.scss'
})
export class FavoriteButton {
	@Input() productName: string = '';
	isFavorite = signal(false);
	isAnimating = signal(false);
	private snackBar = inject(MatSnackBar);

	toggleFavorite(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const newState = !this.isFavorite();
		this.isFavorite.set(newState);
		this.isAnimating.set(true);
		setTimeout(() => this.isAnimating.set(false), 600);

		this.snackBar.openFromComponent(FavoriteSnackbarComponent, {
			data: {
				productName: this.productName || 'Producto',
				added: this.isFavorite()
			},
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: ['favorite-snackbar-panel']
		});
	}
}
