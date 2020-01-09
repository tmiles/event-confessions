import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from './services/data.service';

/**
 * Does filtering of search term and an array of keys of data to search through
 */
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private ds: DataService) {}

  transform(items: any[], searchText: string, fields: any[]): any[] {
    // Basic input matching
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      const res = this.ds.searchFields(it, fields, searchText);
      return res;
    });
  }
}