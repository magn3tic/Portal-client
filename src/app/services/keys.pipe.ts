import { Pipe, PipeTransform } from '@angular/core';
var _ = require('lodash');

@Pipe({name: 'keysPipe'})

export class KeysPipe implements PipeTransform {
  transform(pipeObj: any) {
    // console.log(' valuesPipe results: ', _.keys(pipeObj))
    return _.keys(pipeObj);
  }
}