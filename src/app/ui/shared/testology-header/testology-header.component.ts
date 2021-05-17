import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-testology-header',
  templateUrl: './testology-header.component.html',
  styleUrls: ['./testology-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestologyHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
