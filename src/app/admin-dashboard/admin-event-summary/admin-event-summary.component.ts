import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-admin-event-summary",
  templateUrl: "./admin-event-summary.component.html",
  styles: [],
})
export class AdminEventSummaryComponent {
  @Input("summary") summary$: Observable<any>;
  constructor() {}
}
