import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ServiceRequestPage } from './service-request.page';

describe('ServiceRequestPage', () => {
  let component: ServiceRequestPage;
  let fixture: ComponentFixture<ServiceRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceRequestPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
