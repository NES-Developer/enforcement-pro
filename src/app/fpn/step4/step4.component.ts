import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Weather } from 'src/app/models/weather';
import { Visibility } from 'src/app/models/visibility';
import { POIPrefix } from 'src/app/models/poi-prefix';


@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component  implements OnInit {

    weather: Weather[] = [];
    visibility: Visibility[] = [];
    poi_prefix: POIPrefix[] = [];

    constructor(
        private api: ApiService,
        private data: DataService
    ) {}
    
    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.weather = this.data.getWeather();
        this.visibility = this.data.getVisibility();
        this.poi_prefix = this.data.getPOIPrefix();
    }

}
