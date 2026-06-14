import { Component, input, signal } from '@angular/core';

@Component({
	selector: 'app-discount-tag',
	standalone: true,
	template: `
    <div class="tag-container" [style.color]="backgroundColor()">      
		<svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M2.58311 2.12814C3.2764 0.818856 4.63658 0 6.11809 0H27.4738C29.683 0 31.4738 1.79086 31.4738 4V12C31.4738 14.2091 29.683 16 27.4738 16H6.11809C4.63658 16 3.2764 15.1811 2.58311 13.8719L0.46501 9.87186C-0.155006 8.70097 -0.155006 7.29903 0.465011 6.12814L2.58311 2.12814Z" fill="currentColor"/>
		</svg>
		<span class="tag-text">-{{ percentage() }}%</span>
    </div>
  	`,
	styleUrl: './discount-tag.scss',
})
export class DiscountTagComponent {
	percentage = input.required<number>();
	backgroundColor = input<string>('#00B1FF');
}