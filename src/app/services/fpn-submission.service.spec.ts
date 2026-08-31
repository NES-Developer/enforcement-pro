import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EnviroPost } from '../models/enviro';
import { ApiService } from './enforcementpro/api.service';
import { DataService } from './enforcementpro/data.service';
import { LocationService } from './location.service';
import { PatrolService } from './patrol.service';
import { FpnSubmissionService } from './fpn-submission.service';

describe('FpnSubmissionService', () => {
    let service: FpnSubmissionService;
    let api: jasmine.SpyObj<ApiService>;
    let data: jasmine.SpyObj<DataService>;
    let location: jasmine.SpyObj<LocationService>;
    let patrol: jasmine.SpyObj<PatrolService>;

    beforeEach(() => {
        api = jasmine.createSpyObj('ApiService', ['postFPN']);
        data = jasmine.createSpyObj('DataService', [
            'getUser',
            'getEnviroQue',
            'pushEnviroQueItem',
            'findOffenceById',
            'findOffenceGroupId'
        ]);
        location = jasmine.createSpyObj('LocationService', ['requireCurrentPosition']);
        patrol = jasmine.createSpyObj('PatrolService', ['canUseFpnTools']);

        data.getUser.and.returnValue({ id: 12 });
        data.getEnviroQue.and.returnValue([]);
        data.findOffenceById.and.returnValue(undefined);
        data.findOffenceGroupId.and.returnValue(undefined);
        location.requireCurrentPosition.and.resolveTo({
            latitude: '51.4545',
            longitude: '-2.5879',
            accuracy: 12,
            altitude: null,
            altitudeAccuracy: null,
            speed: null,
            heading: null,
            timestamp: Date.now()
        });
        patrol.canUseFpnTools.and.returnValue(true);

        TestBed.configureTestingModule({
            providers: [
                FpnSubmissionService,
                { provide: ApiService, useValue: api },
                { provide: DataService, useValue: data },
                { provide: LocationService, useValue: location },
                { provide: PatrolService, useValue: patrol }
            ]
        });

        service = TestBed.inject(FpnSubmissionService);
    });

    function makePost(): EnviroPost {
        const post = new EnviroPost();
        post.first_name = 'Luke';
        post.last_name = 'Williams';
        post.offence_location = 'Bristol';
        return post;
    }

    it('queues after three status 0 failures and keeps an officer-readable message', fakeAsync(() => {
        api.postFPN.and.returnValue(throwError(() => ({
            status: 0,
            message: 'Http failure response for https://app.enforcementpro.co.uk/api/app/enviro1: 0 Unknown Error'
        })));

        let result: Awaited<ReturnType<FpnSubmissionService['submit']>> | undefined;
        service.submit(makePost()).then(value => result = value);

        tick(2000);
        tick(4000);

        expect(result?.status).toBe('queued');
        expect(result?.message).toContain('FPN kept in queue after 3 failed attempts');
        expect(result?.message).toContain('Could not reach the server');
        expect(data.pushEnviroQueItem).toHaveBeenCalled();
        expect(api.postFPN).toHaveBeenCalledTimes(3);
    }));

    it('does not retry a 413 payload rejection', async () => {
        api.postFPN.and.returnValue(throwError(() => ({
            status: 413,
            message: 'Payload Too Large'
        })));

        const result = await service.submit(makePost());

        expect(result.status).toBe('failed');
        expect(result.message).toContain('too large');
        expect(api.postFPN).toHaveBeenCalledTimes(1);
        expect(data.pushEnviroQueItem).not.toHaveBeenCalled();
    });

    it('posts successfully through the native API client', async () => {
        api.postFPN.and.returnValue(of({
            success: true,
            data: { fpn_number: 'BCC123' }
        }));

        const result = await service.submit(makePost());

        expect(result.status).toBe('posted');
        expect(result.response.data.fpn_number).toBe('BCC123');
        expect(data.pushEnviroQueItem).not.toHaveBeenCalled();
    });
});
