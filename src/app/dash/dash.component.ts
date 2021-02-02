import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import * as faceapi from 'src/assets/js/face-api.min';

@Component({
  selector: 'app-dash',
  template: ` <main class="h-screen w-screen">
    <div
      [class]="{ hidden: !show }"
      class="absolute flex right-0 top-0 bg-white"
    >
      <video #video autoplay muted [srcObject]="stream" class="h-56"></video>
      <canvas #canvas class="absolute h-56"></canvas>
    </div>
    <div>Welcome</div>
  </main>`,
})
export class DashComponent implements OnInit {
  video: HTMLVideoElement;
  @ViewChild('video') set v(el: ElementRef) {
    this.video = el.nativeElement;
  }

  canvas: HTMLCanvasElement;
  @ViewChild('canvas') set c(el: ElementRef) {
    this.canvas = el.nativeElement;
  }

  stream: MediaStream;
  show = false;
  domready = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/face-api-models'),
      faceapi.nets.ageGenderNet.loadFromUri('assets/face-api-models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('assets/face-api-models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/face-api-models'),
    ]).then(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then(
        (stream: MediaStream) => {
          this.stream = stream;
          this.show = true;
        },
        (e) => console.error(e)
      );

      let detectionsFound: boolean;

      this.video.play().then(() => {
        const displaySize = {
          width: this.video.videoWidth,
          height: this.video.videoHeight,
        };
        faceapi.matchDimensions(this.canvas, displaySize);

        const detect = setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
          faceapi.draw.drawDetections(this.canvas, resizedDetections);
          detectionsFound = detections.length;
        }, 100);

        const checkIsActive = setInterval(() => {
          if (!detectionsFound) {
            clearInterval(detect);
            clearInterval(checkIsActive);
            this.stream.getTracks().forEach((track) => track.stop());
            this.router.navigate(['login']);
            this.show = false;
          }
        }, 10000);
      });
    });
  }
}
