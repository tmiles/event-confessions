import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "objectContains" })
export class ObjectContainsPipe implements PipeTransform {
  /**
   * value: original object
   * args: Object id, object to check through
   */
  transform(value, args: string[]): any[] {
    let res = [];
    value.forEach((el) => {
      if (el && el[args[0]]) {
        if (args[1][el[args[0]]]) {
          res.push(el);
        }
      }
    });
    return res;
  }
}
