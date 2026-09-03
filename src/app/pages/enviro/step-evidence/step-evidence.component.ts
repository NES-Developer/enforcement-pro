import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { DataService } from '../../../services/enforcementpro/data.service';

@Component({
  selector: 'app-step-evidence',
  templateUrl: './step-evidence.component.html',
  styleUrls: ['./step-evidence.component.scss'],
})
export class StepEvidenceComponent implements OnInit {
  enviro_post: EnviroPost = new EnviroPost();

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.enviro_post = this.data.getEnviroPost() || new EnviroPost();
  }
}
