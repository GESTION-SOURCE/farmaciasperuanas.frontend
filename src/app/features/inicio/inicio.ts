import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductListComponent } from './components/product-list/product-list';

@Component({
	selector: 'app-inicio',
	imports: [ProductListComponent],
	templateUrl: './inicio.html',
	styleUrl: './inicio.scss',
})
export class Inicio implements OnInit {
	private titleService = inject(Title);

	ngOnInit(): void {
		this.titleService.setTitle('Farmacia Online Inkafarma | Promociones y delivery con Inkaprecios');
	}
}