import { Component, OnInit } from '@angular/core';
import { Build } from '../../../models/build';
import { HairColour } from '../../../models/hair_colour';
import { NotebookEntry } from '../../../models/notebook-entry';
import { DataService } from '../../../services/enforcementpro/data.service';
import { EnviroPost } from '../../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils'

import { Ethnicity } from 'src/app/models/ethnicity';
import { Weather } from '../../../models/weather';
import { Visibility } from '../../../models/visibility';
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component  implements OnInit {

    // enviro_post: EnviroPost;
    enviro_post = new EnviroPost();

    get ethnicities(): Ethnicity[] {
        return this.data.getEthnicities() || [];
    }

    get weather(): Weather[] {
        return this.data.getWeather() || [];
    }

    get visibility(): Visibility[] {
        return this.data.getVisibility() || [];
    }

    get builds(): Build[] {
        return this.data.getBuilds() || [];
    }

    get hair_colours(): HairColour[] {
        return this.data.getHairColours() || [];
    }

    constructor(
        private data: DataService,
        private fpnPage: EnviroPage
    ) {
        
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }

        this.enviro_post = this.data.getEnviroPost() || new EnviroPost();
        if (!this.enviro_post.notebook_entries) {
            this.enviro_post.notebook_entries = new NotebookEntry();
        }

     }

    ngOnInit() {
    }
  
    onInputChange(){ 
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        if (!this.enviro_post.notebook_entries) {
            this.enviro_post.notebook_entries = new NotebookEntry();
        }
        this.data.setEnviroPost(this.enviro_post);
    }


}
