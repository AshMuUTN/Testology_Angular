import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Image } from '@entities/image/image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {

  @Input() imageItem: Image;

  constructor() { }

  ngOnInit(): void {
  }

  createImagePath(path: string){
    return `${environment.backendServer}/${path}`
  }

}
