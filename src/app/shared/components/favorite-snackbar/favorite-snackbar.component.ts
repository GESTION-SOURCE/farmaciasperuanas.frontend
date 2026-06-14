import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

export interface IFavoriteSnackData {
	productName: string;
	added: boolean;
}

@Component({
	selector: 'app-favorite-snackbar',
	standalone: true,
	imports: [MatIconModule],
	template: `
		<div class="favorite-toast" [class.toast-remove]="!data.added">
			<div class="toast-icon-wrapper">
				<div class="toast-icon">
					<mat-icon>{{ data.added ? 'favorite' : 'heart_broken' }}</mat-icon>
				</div>
				<div class="toast-pulse"></div>
			</div>
			<div class="toast-content">
				<span class="toast-title">{{ data.added ? '¡Añadido a favoritos!' : 'Eliminado de favoritos' }}</span>
				<span class="toast-product">{{ data.productName }}</span>
			</div>
			<button class="toast-close" (click)="dismiss()">
				<mat-icon>close</mat-icon>
			</button>
			<div class="toast-progress">
				<div class="toast-progress-bar"></div>
			</div>
		</div>
	`,
	styleUrls: ['./favorite-snackbar.component.scss']
})
export class FavoriteSnackbarComponent {
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: IFavoriteSnackData,
		private snackBarRef: MatSnackBarRef<FavoriteSnackbarComponent>
	) { }

	dismiss() {
		this.snackBarRef.dismiss();
	}
}
