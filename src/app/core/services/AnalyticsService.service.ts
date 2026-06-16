import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const gtag: Function;

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private router = inject(Router);

    constructor() {
        this.initPageTracking();
    }

    private initPageTracking(): void {
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            gtag('event', 'page_view', {
                page_path: event.urlAfterRedirects
            });
        });
    }

    /*
     * Evento: Al ver el detalle de un producto (PDP)
     */
    trackViewItem(product: any): void {
        gtag('event', 'view_item', {
            currency: 'PEN',
            value: product.price,
            items: [{
                item_id: product.sId,
                item_name: product.sName,
                price: product.nPrice
            }]
        });
    }

    /**
     * Evento: Al presionar el botón "Agregar al carrito"
     */
    trackAddToCart(product: any, quantity: number = 1): void {
        gtag('event', 'add_to_cart', {
            currency: 'PEN',
            value: product.nPrice * quantity,
            items: [{
                item_id: product.sId,
                item_name: product.sName,
                price: product.nPrice,
                quantity: quantity
            }]
        });
    }
}