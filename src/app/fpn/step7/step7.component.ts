import { Component, OnInit } from '@angular/core';
import { Build } from '../../models/build';
import { HairColour } from '../../models/hair_colour';
import { NotebookEntry } from '../../models/notebook-entry';
import { DataService } from '../../services/enforcementpro/data.service';
import { EnviroPost } from '../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils'

import { Ethnicity } from 'src/app/models/ethnicity';
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { FPNPage } from '../fpn.page';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component  implements OnInit {

    // enviro_post: EnviroPost;
    enviro_post = new EnviroPost();
    ethnicities: Ethnicity[] = [];
    weather: Weather[] = [];
    visibility: Visibility[] = [];

    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private data: DataService,
        private fpnPage: FPNPage
    ) {
        
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }
        this.loadData();

        this.enviro_post = new EnviroPost();
        this.enviro_post.notebook_entries = new NotebookEntry();

        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

     }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        this.ethnicities = this.data.getEthnicities();
        this.weather = this.data.getWeather();
        this.visibility = this.data.getVisibility();
        
    }
  
    onInputChange(){ 
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        if (this.enviro_post.notebook_entries.hair !== 0 && this.enviro_post.notebook_entries.were !== '' && this.enviro_post.notebook_entries.did !== '' && this.enviro_post.notebook_entries.is_fpn_advised !== '' && this.enviro_post.notebook_entries.is_fpn_handed !== '')
        {
            this.data.setEnviroPost(this.enviro_post);
        }
    }


}
