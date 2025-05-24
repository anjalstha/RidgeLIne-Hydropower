import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.commonService.isMobileDevice = this.commonService.checkMobileDevice();
}
}
