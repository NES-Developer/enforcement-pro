import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FPNPage } from './fpn.page';

describe('FPNPage', () => {
  let component: FPNPage;
  let fixture: ComponentFixture<FPNPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FPNPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FPNPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
