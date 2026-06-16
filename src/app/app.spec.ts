import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

describe('@App', () => {
	let component: App;
	let fixture: ComponentFixture<App>;
	let routerEventsSubject: Subject<any>;
	let mockRouter: any;

	beforeEach(async () => {
		// Arrange
		routerEventsSubject = new Subject<any>();
		mockRouter = {
			events: routerEventsSubject.asObservable()
		};

		await TestBed.configureTestingModule({
			imports: [App],
			providers: [
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(App);
		component = fixture.componentInstance;
	});

	it('#Should create When instantiated', () => {
		// Arrange
		// Act
		fixture.detectChanges();
		// Assert
		expect(component).toBeTruthy();
	});

	it('#Should set isLoading to false When NavigationEnd event is emitted after 1000ms delay', () => {
		// Arrange
		vi.useFakeTimers();
		fixture.detectChanges(); // calls ngOnInit

		// Act
		routerEventsSubject.next(new NavigationEnd(1, '/', '/'));
		vi.advanceTimersByTime(1000);

		// Assert
		expect(component['isLoading']()).toBe(false);
		vi.useRealTimers();
	});

	it('#Should not set isLoading to false When other router events are emitted', () => {
		// Arrange
		vi.useFakeTimers();
		fixture.detectChanges();

		// Act
		routerEventsSubject.next({ id: 1, url: '/' }); // Not NavigationEnd
		vi.advanceTimersByTime(1000);

		// Assert
		expect(component['isLoading']()).toBe(true);
		vi.useRealTimers();
	});
});