import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnviroPage } from './enviro.page';

describe('EnviroPage', () => {
  let component: EnviroPage;
  let fixture: ComponentFixture<EnviroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
