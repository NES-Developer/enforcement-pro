import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitePage } from './site.page';

describe('SitePage', () => {
  let component: SitePage;
  let fixture: ComponentFixture<SitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
