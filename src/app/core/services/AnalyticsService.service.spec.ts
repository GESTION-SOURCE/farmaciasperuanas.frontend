import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsService } from './AnalyticsService.service';

describe('@AnalyticsService', () => {
	let service: AnalyticsService;
	let routerEventsSubject: Subject<any>;

	beforeEach(() => {
		vi.stubGlobal('gtag', vi.fn());
		routerEventsSubject = new Subject<any>();

		TestBed.configureTestingModule({
			providers: [
				AnalyticsService,
				{
					provide: Router,
					useValue: { events: routerEventsSubject.asObservable() }
				}
			]
		});
		
		service = TestBed.inject(AnalyticsService);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('#Should track page_view When NavigationEnd event is emitted', () => {
		// Arrange
		const navEvent = new NavigationEnd(1, '/test', '/test');

		// Act
		routerEventsSubject.next(navEvent);

		// Assert
		expect((globalThis as any).gtag).toHaveBeenCalledWith('event', 'page_view', { page_path: '/test' });
	});

	it('#Should track view_item When trackViewItem is executed', () => {
		// Arrange
		const product = { sId: '1', sName: 'Test', price: 100, nPrice: 100 };

		// Act
		service.trackViewItem(product);

		// Assert
		expect((globalThis as any).gtag).toHaveBeenCalledWith('event', 'view_item', {
			currency: 'PEN',
			value: 100,
			items: [{ item_id: '1', item_name: 'Test', price: 100 }]
		});
	});

	it('#Should track add_to_cart When trackAddToCart is executed', () => {
		// Arrange
		const product = { sId: '1', sName: 'Test', nPrice: 100 };
		const quantity = 2;

		// Act
		service.trackAddToCart(product, quantity);

		// Assert
		expect((globalThis as any).gtag).toHaveBeenCalledWith('event', 'add_to_cart', {
			currency: 'PEN',
			value: 200,
			items: [{ item_id: '1', item_name: 'Test', price: 100, quantity: 2 }]
		});
	});
});
