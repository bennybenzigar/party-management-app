import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinner: NgxSpinnerService) { }
  private requestCount = 0;

  // constructor(private spinner: NgxSpinnerService) {}

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.spinner.show();
    }
  }

  hide() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.spinner.hide();
    }
  }
}
