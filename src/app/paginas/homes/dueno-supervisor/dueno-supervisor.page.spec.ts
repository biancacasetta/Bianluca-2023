import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuenoSupervisorPage } from './dueno-supervisor.page';

describe('DuenoSupervisorPage', () => {
  let component: DuenoSupervisorPage;
  let fixture: ComponentFixture<DuenoSupervisorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DuenoSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
