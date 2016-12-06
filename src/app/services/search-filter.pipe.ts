import { Pipe, PipeTransform, Injectable } from '@angular/core';
var _ = require('lodash');

@Pipe({ name: 'searchFilterPipe' })
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
    // console.log('SearchFilterPipe items: ', items, ' args: ', args);      
    return _.filter(items, client => client.name.indexOf(args) ? false : client.name);
  }
}