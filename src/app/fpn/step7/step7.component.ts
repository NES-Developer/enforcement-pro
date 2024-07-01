import { Component, OnInit } from '@angular/core';
import { Build } from '../../models/build';
import { HairColour } from '../../models/hair_colour';
import { NotebookEntry } from '../../models/notebook-entry';
import { DataService } from '../../services/enforcementpro/data.service';
import { EnviroPost } from '../../models/enviro';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component  implements OnInit {

    enviro_post: EnviroPost = new EnviroPost();

    // notebook_entries: NotebookEntry = new NotebookEntry();
    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private data: DataService,
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }


}
