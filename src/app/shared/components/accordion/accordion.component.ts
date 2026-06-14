import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
	selector: 'app-accordion',
	standalone: true,
	imports: [CommonModule, MatExpansionModule],
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
	@Input({ required: true }) title!: string;
	@Input() expanded = false;

	ngOnInit() { }
}
