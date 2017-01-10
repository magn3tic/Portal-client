import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'test',
  styles: [require('./test.component.css')],
  template: require('./test.component.html')
})
export class Test implements OnInit{
  route: any = 'none yet';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.route = window.location;
  }

};
