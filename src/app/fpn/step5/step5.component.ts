import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { POIPrefix } from '../../models/poi-prefix';
import { EnviroPost } from 'src/app/models/enviro';
import { Observable, Subscriber } from 'rxjs';
import * as moment from 'moment';  // Import moment.js for date formatting


@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component  implements OnInit {

    weather: Weather[] = [];
    visibility: Visibility[] = [];
    poi_prefix: POIPrefix[] = [];

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data: DataService
    ) {
        const defaultDate = moment().format('YYYY-MM-DD HH:mm');
        this.enviro_post.offence_datetime = defaultDate;
        this.enviro_post.issue_datetime = defaultDate;
        console.log(this.enviro_post.offence_datetime, this.enviro_post.issue_datetime);
    }
    
    ngOnInit() {
        this.loadData();
    }

    get offenceDateTimeISO(): string {
        return this.enviro_post.offence_datetime ? moment(this.enviro_post.offence_datetime).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    get issueDateTimeISO(): string {
        return this.enviro_post.issue_datetime ? moment(this.enviro_post.issue_datetime).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    private getCurrentPosition(): any {
        return new Observable((observer: Subscriber<any>) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position: any) => {
                observer.next({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                observer.complete();
                });
            } else {
                observer.error();
            }
        });
    }

    loadData() {
        this.weather = this.data.getWeather();
        this.visibility = this.data.getVisibility();
        this.poi_prefix = this.data.getPOIPrefix();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.enviro_post.lat = position.latitude;
            this.enviro_post.lng = position.longitude;
        });
    }

    saveEnviroData() {
        const formattedDate = moment(this.enviro_post.offence_datetime).format('YYYY-MM-DD HH:mm');
        const formattedIssueDate = moment(this.enviro_post.issue_datetime).format('YYYY-MM-DD HH:mm');
        this.enviro_post.offence_datetime = formattedDate.toString();
        this.enviro_post.issue_datetime = formattedIssueDate.toString();
            
        this.data.setEnviroPost(this.enviro_post);
    }

}
