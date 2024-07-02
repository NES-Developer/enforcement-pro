import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    enviro_post: EnviroPost = new EnviroPost();
    enviro_que: EnviroPost[] = [];


    constructor(
        // private api: ApiService,
        private data:DataService,
        // private fpnPage: FPNPage
    ) {
        
    }
    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.enviro_que =  this.data.getEnviroQue();
        console.log(this.enviro_que);
    }
}
