import { Pipe, PipeTransform } from '@angular/core';
import { Test } from '@entities/test/test';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(value: Test[], arg: any): any {
    const result = [];
    for (const test of value) {
        if (
            test.name.toUpperCase().indexOf(arg.toUpperCase()) > -1 ||
            test.description.toUpperCase().indexOf(arg.toUpperCase()) > -1
        ) {
            result.push(test);
        }
    }
    return result;
}

}
