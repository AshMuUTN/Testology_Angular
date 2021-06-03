import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Image } from '@entities/image/image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrls: ['./image-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListItemComponent implements OnInit {

  @Input() imageItem: Image;
  @Input() imageForQuestionFlag: boolean;
  @Output() showImageEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  showImage(){
    this.showImageEvent.emit();
  }

  createImagePath(path: string){
    return `${environment.backendServer}/${path}`
  }

}
