import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
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

  constructor(private redirectorService: RedirectorService) { }

  ngOnInit(): void {
  }

  forwardLinkClicked(){
    this.redirectorService.goToUrl(this.titleForwardUrl);
  }

}
