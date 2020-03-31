import { Component, Input } from "@angular/core";
import {
  trigger,
  state,
  transition,
  style,
  animate
} from "@angular/animations";

@Component({
  selector: "app-confession-card",
  templateUrl: "./confession-card.component.html",
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ],
  styles: [
    `
      .example-element-detail {
        overflow: hidden;
        display: flex;
        padding: 10px 20px;
      }
    `
  ]
})
export class ConfessionCardComponent {
  @Input() confession: any;
  expanded = false;
  constructor() {}
}
