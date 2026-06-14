import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout/layout').then(m => m.Layout),
		children: [
			{
				path: '',
				redirectTo: 'inicio',
				pathMatch: 'full'
			},
			{
				path: 'inicio',
				loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio)
			},
			{
				path: 'products/:id',
				loadComponent: () => import('./features/producto/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
			}
		]
	},
	{
		path: '**',
		redirectTo: 'inicio'
	}
];