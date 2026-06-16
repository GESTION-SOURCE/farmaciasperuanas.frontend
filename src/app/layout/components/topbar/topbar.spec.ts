import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Topbar } from './topbar';

describe('@Topbar', () => {
	let component: Topbar;
	let fixture: ComponentFixture<Topbar>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Topbar]
		}).compileComponents();

		fixture = TestBed.createComponent(Topbar);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should create the topbar When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});
});