import { Component, OnInit } from '@angular/core';
import { Build } from '../../models/build';
import { HairColour } from '../../models/hair_colour';
import { NotebookEntry } from '../../models/notebook-entry';
import { DataService } from '../../services/enforcementpro/data.service';
import { EnviroPost } from '../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils'

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component  implements OnInit {

    // enviro_post: EnviroPost;
    enviro_post = new EnviroPost();

    // notebook_entries: NotebookEntry = {
    //     enviro_id: 0,
    //     is_fpn_advised: '',
    //     is_fpn_handed: '',
    //     height_in_feet: '',
    //     height_in_inch: '',
    //     build: '',
    //     hair: 0,
    //     distance_from_offender: '',
    //     distinguishing_features: '',
    //     have_reason: '',
    //     nearest_bin: '',
    //     were: '',
    //     did: '',
    //     police_comments: '',
    //     offender_comments: '',
    //     bwv_assest: ''
    // };

    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private data: DataService,
    ) {
        this.enviro_post = new EnviroPost();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.enviro_post.notebook_entries = new NotebookEntry();
     }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        
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
