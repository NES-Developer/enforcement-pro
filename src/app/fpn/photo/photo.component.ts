import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { EnviroPost } from "../../models/enviro";
import { DataService } from "../../services/enforcementpro/data.service";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent  implements AfterViewInit {
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

    ngOnInit() {}

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
        this.isCaptured = true;
      }
    
      removeCurrent() {
        this.isCaptured = false;
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

      loadData() {
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
