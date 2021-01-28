import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "favorited" })
export class IsFavoritedPipe implements PipeTransform {
  transform(value, args: any): boolean {
    return value && value["id"] && args[value["id"]] ? true : false;
  }
}
