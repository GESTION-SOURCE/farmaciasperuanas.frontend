import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FooterLinksComponent } from './footer-links.component';

describe('FooterLinksComponent', () => {
  let component: FooterLinksComponent;
  let fixture: ComponentFixture<FooterLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterLinksComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FooterLinksComponent);
    component = fixture.componentInstance;

    // Definimos el input requerido antes de disparar la detección de cambios
    component.section = {
      title: 'Test Section',
      links: [
        { text: 'Link 1', url: '/test1' },
        { text: 'Link 2', url: '/test2' }
      ]
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement = fixture.debugElement.query(By.css('.footer-title')).nativeElement;
    expect(titleElement.textContent).toContain('Test Section');
  });

  it('should render the correct number of links with their text', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('.footer-links li a'));
    expect(linkElements.length).toBe(2);
    expect(linkElements[0].nativeElement.textContent.trim()).toBe('Link 1');
    expect(linkElements[1].nativeElement.textContent.trim()).toBe('Link 2');
  });
});
