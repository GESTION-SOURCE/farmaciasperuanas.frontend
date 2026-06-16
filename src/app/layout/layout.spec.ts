import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { RouterModule } from '@angular/router';

describe('@Layout', () => {
	let component: Layout;
	let fixture: ComponentFixture<Layout>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Layout, RouterModule.forRoot([])]
		}).compileComponents();

		fixture = TestBed.createComponent(Layout);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#Should create the layout When instantiated', () => {
		// Arrange
		// Act
		// Assert
		expect(component).toBeTruthy();
	});
});
