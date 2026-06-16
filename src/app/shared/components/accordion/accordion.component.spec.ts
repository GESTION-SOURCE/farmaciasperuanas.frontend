import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';

describe('@AccordionComponent', () => {
	let component: AccordionComponent;
	let fixture: ComponentFixture<AccordionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AccordionComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AccordionComponent);
		component = fixture.componentInstance;
	});

	it('#Should render the title When input is provided', () => {
		// Arrange
		fixture.componentRef.setInput('title', 'My Title');

		// Act
		fixture.detectChanges();
		const titleElement = fixture.nativeElement.querySelector('.mat-expansion-panel-header-title');

		// Assert
		expect(titleElement.textContent.trim()).toBe('My Title');
	});
});
