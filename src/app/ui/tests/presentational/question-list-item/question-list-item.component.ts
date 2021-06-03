import { Question } from '@entities/question/question';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionListItemComponent implements OnInit {

  @Input() testItem: Question;
  @Input() deletingEnabled: boolean;
  @Output() showQuestionEvent = new EventEmitter<void>();
  @Output() editAction =  new EventEmitter<void>();
  @Output() deleteAction =  new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type : 'primary-sm'}


  constructor() { }

  ngOnInit(): void {}

  showQuestion(){
    this.showQuestionEvent.emit();
  }

  editQuestion(){
    this.editAction.emit();
  }

  deleteTest(){
    this.deleteAction.emit();
  }

  createImagePath(path: string){
    return `${environment.backendServer}/${path}`
  }

}
