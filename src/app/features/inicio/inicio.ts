import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list';

@Component({
	selector: 'app-inicio',
	imports: [ProductListComponent],
	templateUrl: './inicio.html',
	styleUrl: './inicio.scss',
})
export class Inicio {

}