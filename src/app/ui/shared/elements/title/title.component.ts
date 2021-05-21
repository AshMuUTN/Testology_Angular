import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { RedirectorService } from 'src/app/application/services/redirector.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {

  @Input() titleText : string;
  @Input() titleForwardText : string;
  @Input() titleForwardUrl: string;
  @Input() titleBackText : string;
  @Input() titleBackUrl: string;
  // outputs used in absense of url for back and forward
  @Output() goBack = new EventEmitter<void>();
  @Output() goForward = new EventEmitter<void>();

  constructor(private redirectorService: RedirectorService) { }

  ngOnInit(): void {}

  forwardLinkClicked(){
    if(this.titleForwardUrl){
      this.redirectorService.goToUrl(this.titleForwardUrl);
    } else {
      this.goForward.emit();
    }
  }

  backLinkClicked(){
    if(this.titleBackUrl){
      this.redirectorService.goToUrl(this.titleBackUrl);
    } else {
      this.goBack.emit();
    }
  }

}
