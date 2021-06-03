import { Pipe, PipeTransform } from '@angular/core';
import { Test } from '@entities/test/test';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(value: Object[], arg: any, key1: string = 'name', key2: string = 'description'): any {
    const result = [];
    for (const test of value) {
        if (
            test[key1].toUpperCase().indexOf(arg.toUpperCase()) > -1 ||
            test[key2].toUpperCase().indexOf(arg.toUpperCase()) > -1
        ) {
            result.push(test);
        }
    }
    return result;
}

}
