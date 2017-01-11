import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'pageNotFound',
  styles: [require('./pageNotFound.component.css')],
  template: require('./pageNotFound.component.html')
})
export class PageNotFound implements OnInit{
  route: any = 'none';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.route = window.location;
  }

};
