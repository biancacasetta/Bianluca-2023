import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaClientePage } from './encuesta-cliente.page';

describe('EncuestaClientePage', () => {
  let component: EncuestaClientePage;
  let fixture: ComponentFixture<EncuestaClientePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EncuestaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
