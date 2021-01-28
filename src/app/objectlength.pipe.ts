import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "objectLength" })
export class ObjectLengthPipe implements PipeTransform {
  transform(value, args: string[]): number {
    if (args && args["type"] === "array") {
      return value.length;
    }
    return Object.keys(value).length;
  }
}
