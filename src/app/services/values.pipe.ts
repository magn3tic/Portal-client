import { Pipe, PipeTransform } from '@angular/core';
var _ = require('lodash');

@Pipe({name: 'valuesPipe'})

export class ValuesPipe implements PipeTransform {
  transform(pipeObj: any) {
    console.log(' valuesPipe results: ', _.values(pipeObj))
    return _.values(pipeObj);
  }
}