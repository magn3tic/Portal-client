import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'token-display',
  styles: [require('./token-display.component.css')],
  template: require('./token-display.component.html')
})
export class TokenDisplay implements OnInit{
  route: any = 'none';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.route = window.location;
  }

};
