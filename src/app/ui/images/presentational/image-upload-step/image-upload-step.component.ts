import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Image } from '@entities/image/image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-upload-step',
  templateUrl: './image-upload-step.component.html',
  styleUrls: ['./image-upload-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadStepComponent implements OnInit {
  
  @Input() parentFormGroup: FormGroup;
  @Input() name: string;
  @Input() image: Image;
  @Output() processFileEvent = new EventEmitter<any>();
  @Output() attemptSubmit = new EventEmitter<void>();

  constructor(){}

  ngOnInit(){}
  
  processFile(imageInput: any) {
    this.processFileEvent.emit(imageInput);
  }

  enterPressedAction(){
    this.attemptSubmit.emit();
  }

  createImagePath(path: string){
    return `${environment.backendServer}/${path}`
  }

}
