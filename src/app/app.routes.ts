import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout/layout').then(m => m.Layout),
		children: [
			{
				path: '',
				loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio),
				pathMatch: 'full'
			},
			{
				path: 'products/:id',
				loadComponent: () => import('./features/producto/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
			},
			{
				path: '404',
				loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
			}
		]
	},
	{
		path: '**',
		redirectTo: '404'
	}
];