import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { EnviroPost } from '../models/enviro';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { TicketService } from './ticket.service';

describe('TicketService', () => {
  let service: TicketService;
  let data: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Storage,
          useValue: {
            create: () => new Promise(() => undefined)
          }
        }
      ]
    });
    service = TestBed.inject(TicketService);
    data = TestBed.inject(DataService);
    const auth = TestBed.inject(AuthService);

    spyOn(data, 'getSelectedSite').and.returnValue({
      id: 1,
      name: 'Test Council',
      slug: 'test-council',
    } as any);
    spyOn(data, 'findOffenceById').and.returnValue({
      id: 9,
      name: 'Littering',
      description: 'Dropped litter',
      offenceGroup: { englishName: 'Littering' },
      engLegislation: { legislation: 'EPA 1990 s87' },
    } as any);
    spyOn(data, 'findOffenceGroupId').and.returnValue({ englishName: 'Littering' } as any);
    spyOn(data, 'findSiteOffence').and.returnValue({
      charge_amount_reduced: 80,
      charge_amount_full: 100,
      charge_days_reduced: 10,
      charge_days_full: 28,
    } as any);
    spyOn(data, 'updateEnviroInQue').and.stub();
    spyOn(data, 'takeFPNNumberOfflinePrinter').and.returnValue(null);
    spyOn(auth, 'getUser').and.returnValue({ id: 4, operator_number: 'OP12' } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('builds a receipt ticket with the same sections as the server notice', () => {
    const post = new EnviroPost();
    post.fpn_number = '123456789';
    post.barcode = '1234567890';
    post.first_name = 'Jane';
    post.last_name = 'Doe';
    post.address = '1 High Street';
    post.town = 'Leeds';
    post.offence_location = 'Market Street';
    post.poi = 'Outside';
    post.offence_type_id = 9;
    post.offence_id = 1;

    const html = service.generateWelcomeTicket(post);

    expect(html).toContain('Fixed Penalty Notice');
    expect(html).toContain('How To Pay');
    expect(html).toContain('By Cash');
    expect(html).toContain('Name:');
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Outside, Market Street, Leeds');
    expect(html).toContain('www.paymyfpn.co.uk/fpn/test-council');
    expect(html).toContain('width="120"');
    expect(html).toContain('1234567890');
  });
});
