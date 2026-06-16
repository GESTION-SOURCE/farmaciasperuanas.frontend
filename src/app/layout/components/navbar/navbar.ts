import { Component, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef, Renderer2, inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnDestroy {
	public cartService = inject(CartService);
	isSticky = false;
	navbarHeight = 80;
	stickyNavbarHeight = 80;
	isMobileMenuOpen = false;
	isSearchFocused = false;
	navbarOffsetTop = 36;
	private scrollSub!: Subscription;

	@ViewChild('navbarMain') navbarMain!: ElementRef;
	@ViewChild('navbarWrapper') navbarWrapper!: ElementRef;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private ngZone: NgZone,
		private cdr: ChangeDetectorRef,
		private renderer: Renderer2
	) { }

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			// Defer height calculation to avoid ExpressionChangedAfterItHasBeenCheckedError
			Promise.resolve().then(() => {
				if (this.navbarMain) {
					this.navbarHeight = this.navbarMain.nativeElement.offsetHeight;
					if (window.innerWidth <= 992) {
						this.stickyNavbarHeight = 64; // Height of the mobile row without search bar
					} else {
						this.stickyNavbarHeight = this.navbarHeight;
					}
				}
				if (this.navbarWrapper) {
					this.navbarOffsetTop = this.navbarWrapper.nativeElement.getBoundingClientRect().top + window.scrollY;
				}
			});

			this.ngZone.runOutsideAngular(() => {
				this.scrollSub = fromEvent(window, 'scroll')
					.pipe(
						map(() => window.scrollY >= this.navbarOffsetTop),
						distinctUntilChanged()
					)
					.subscribe((isCurrentlySticky) => {
						this.ngZone.run(() => {
							this.isSticky = isCurrentlySticky;
							this.cdr.detectChanges();
						});
					});
			});
		}
	}

	toggleMobileMenu() {
		this.isMobileMenuOpen = !this.isMobileMenuOpen;
		if (isPlatformBrowser(this.platformId)) {
			if (this.isMobileMenuOpen) {
				this.renderer.addClass(document.body, 'overflow-hidden');
			} else {
				this.renderer.removeClass(document.body, 'overflow-hidden');
			}
		}
	}

	// Método vacío para evitar que el HMR de Angular colapse si el template antiguo sigue en caché
	onWindowScroll() { }

	ngOnDestroy() {
		if (this.scrollSub) {
			this.scrollSub.unsubscribe();
		}
	}
}