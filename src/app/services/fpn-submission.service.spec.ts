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
    let queue: EnviroPost[];

    beforeEach(() => {
        queue = [];
        api = jasmine.createSpyObj('ApiService', ['postFPN', 'postFPNImage']);
        data = jasmine.createSpyObj('DataService', [
            'getUser',
            'getEnviroQue',
            'pushEnviroQueItem',
            'updateEnviroInQue',
            'spliceEnviroQue',
            'persistEnviroQue',
            'findOffenceById',
            'findOffenceGroupId'
        ]);
        location = jasmine.createSpyObj('LocationService', ['requireCurrentPosition']);
        patrol = jasmine.createSpyObj('PatrolService', ['canUseFpnTools']);

        data.getUser.and.returnValue({ id: 12 });
        data.getEnviroQue.and.callFake(() => queue);
        data.pushEnviroQueItem.and.callFake((item: EnviroPost) => queue.push(item));
        data.updateEnviroInQue.and.callFake((oldItem: EnviroPost, next: EnviroPost) => {
            const index = queue.indexOf(oldItem);
            if (index > -1) {
                queue[index] = next;
                return;
            }
            const byLocal = queue.findIndex(item => item.local_id && item.local_id === oldItem.local_id);
            if (byLocal > -1) {
                queue[byLocal] = next;
            }
        });
        data.spliceEnviroQue.and.callFake((item: EnviroPost) => {
            const index = queue.indexOf(item);
            if (index > -1) {
                queue.splice(index, 1);
                return;
            }
            const byLocal = queue.findIndex(row => row.local_id && row.local_id === item.local_id);
            if (byLocal > -1) {
                queue.splice(byLocal, 1);
            }
        });
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

    it('splits a 413 payload and uploads images one at a time', async () => {
        api.postFPN.and.returnValues(
            throwError(() => ({
                status: 413,
                message: 'Payload Too Large'
            })),
            of({
                success: true,
                data: { id: 99, fpn_number: 'BCC123', ticket: 'uploads/tickets/t.pdf' }
            })
        );
        api.postFPNImage.and.returnValue(of({ success: true }));

        const post = makePost();
        post.offence_images = ['data:image/jpeg;base64,abc', 'data:image/jpeg;base64,def'];

        const result = await service.submit(post);

        expect(result.status).toBe('posted');
        expect(result.message).toContain('uploaded separately');
        expect(api.postFPN).toHaveBeenCalledTimes(2);
        expect(api.postFPN.calls.mostRecent().args[0].offence_images).toEqual([]);
        expect(api.postFPNImage).toHaveBeenCalledTimes(2);
        expect(api.postFPNImage.calls.first().args[0]).toBe(99);
        expect(queue.length).toBe(0);
    });

    it('submits many photos separately without sending them on the FPN create call', async () => {
        api.postFPN.and.returnValue(of({
            success: true,
            data: { id: 44, fpn_number: 'BCC999' }
        }));
        api.postFPNImage.and.returnValue(of({ success: true }));

        const post = makePost();
        post.offence_images = ['img-a', 'img-b', 'img-c'];

        const result = await service.submit(post);

        expect(result.status).toBe('posted');
        expect(api.postFPN).toHaveBeenCalledTimes(1);
        expect(api.postFPN.calls.mostRecent().args[0].offence_images).toEqual([]);
        expect(api.postFPNImage).toHaveBeenCalledTimes(3);
    });

    it('compresses and retries a failed image upload', async () => {
        api.postFPN.and.returnValue(of({
            success: true,
            data: { id: 7, fpn_number: 'BCC007' }
        }));
        api.postFPNImage.and.returnValues(
            throwError(() => ({ status: 413, message: 'Payload Too Large' })),
            of({ success: true })
        );

        const post = makePost();
        post.enviro_id = 7;
        post.offence_images = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='];

        const result = await service.submit(post);

        expect(result.status).toBe('posted');
        expect(api.postFPN).not.toHaveBeenCalled();
        expect(api.postFPNImage).toHaveBeenCalledTimes(2);
    });

    it('holds remaining photos when an image still fails after compression', async () => {
        api.postFPN.and.returnValue(of({
            success: true,
            data: { id: 8, fpn_number: 'BCC008' }
        }));
        api.postFPNImage.and.returnValue(throwError(() => ({ status: 500, message: 'Server error' })));

        const post = makePost();
        post.offence_images = ['img-a', 'img-b', 'img-c'];

        const result = await service.submit(post);

        expect(result.status).toBe('queued');
        expect(result.message).toContain('still need to upload');
        expect(queue.length).toBe(1);
        expect(queue[0].enviro_id).toBe(8);
        expect(queue[0].offence_images.length).toBe(3);
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
