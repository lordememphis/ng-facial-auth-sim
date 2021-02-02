import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import * as faceapi from 'src/assets/js/face-api.min';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
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

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/face-api-models'),
      faceapi.nets.ageGenderNet.loadFromUri('assets/face-api-models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('assets/face-api-models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/face-api-models'),
    ]).then(() => {
      this.domready = true;
    });
  }

  scan() {
    if (!this.domready) return;

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
          this.show = false;
        }
      }, 10000);
    });
  }
}
