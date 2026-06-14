import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-product-card-skeleton',
	standalone: true,
	templateUrl: './product-card-skeleton.component.html',
	styleUrls: ['./product-card-skeleton.component.scss']
})
export class ProductCardSkeletonComponent {
	@Input() count = 8;

	get skeletonItems(): number[] {
		return Array(this.count).fill(0);
	}
}