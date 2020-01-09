import { Pipe, PipeTransform } from '@angular/core';
/**
 * https://stackoverflow.com/questions/35158817/angular-2-orderby-pipe
 */

@Pipe({
  name: 'sort'
})
export class ArraySortPipe  implements PipeTransform {
  transform(array: any, field: string, direction: 'ascending' | 'descending'): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    const retVal = (direction === 'ascending') ? 1 : -1;
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1 * retVal;
      } else if (a[field] > b[field]) {
        return 1 * retVal;
      } else {
        return 0;
      }
    });
    return array;
  }
}