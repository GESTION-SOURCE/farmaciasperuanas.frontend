import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { Inicio } from './inicio';

describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [
        { provide: Title, useValue: titleServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title on init', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Farmacia Online Inkafarma | Promociones y delivery con Inkaprecios');
  });
});
