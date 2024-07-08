import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { EnviroPost } from "../../models/enviro";
import { DataService } from "../../services/enforcementpro/data.service";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent  implements OnInit, AfterViewInit {
    WIDTH = 640;
    HEIGHT = 480;
  
    @ViewChild("video")
    public video!: ElementRef;
  
    @ViewChild("canvas")
    public canvas!: ElementRef;

    enviro_post: EnviroPost = new EnviroPost();

  
    captures: string[] = [];
    error: any;
    isCaptured!: boolean;

    constructor(
      private data: DataService,
    ) { }

    ngOnInit() {
        this.loadData();
    }

    async ngAfterViewInit() {
        await this.setupDevices();
    }
    
    async setupDevices() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true
            });
            if (stream) {
              this.video.nativeElement.srcObject = stream;
              this.video.nativeElement.play();
              this.error = null;
            } else {
              this.error = "You have no output video device";
            }
          } catch (e) {
            this.error = e;
          }
        }
    }
    
    capture() {
        this.drawImageToCanvas(this.video.nativeElement);
        this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
        this.enviro_post.offence_images.push(this.canvas.nativeElement.toDataURL("image/png"));
        this.saveEnviroData();
    }
    
    setPhoto(idx: number) {
        this.isCaptured = true;
        var image = new Image();
        image.src = this.captures[idx];
        image.src = this.enviro_post.offence_images[idx];
        this.drawImageToCanvas(image);
    }
    
    drawImageToCanvas(image: any) {
        this.canvas.nativeElement
          .getContext("2d")
          .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
    }

    removeCurrent() {
        this.isCaptured = false;
    }

    loadData() {
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    removePhoto(idx: number) {
        this.captures.splice(idx, 1);
        this.enviro_post.offence_images.splice(idx, 1);
        this.saveEnviroData();
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
