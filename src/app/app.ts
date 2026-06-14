import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, take } from 'rxjs';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App implements OnInit {
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);

	protected readonly title = signal('ecommerce-app');
	protected readonly isLoading = signal(true);

	ngOnInit(): void {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				take(1),
				delay(1000),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.isLoading.set(false);
			});
	}
}