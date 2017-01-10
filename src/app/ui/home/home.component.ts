import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'home',
  styles: [require('./home.component.css')],
  template: require('./home.component.html')
})
export class Home implements OnInit{
  route: any = 'none yet';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.route = window.location;
  }

};
