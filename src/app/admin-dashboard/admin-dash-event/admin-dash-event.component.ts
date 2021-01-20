import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../../services/data.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-admin-event",
  templateUrl: "./admin-dash-event.component.html",
  styles: [],
})
export class AdminDashEventComponent implements OnInit {
  @Input("event") event$: Observable<any>;
  event = null;
  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.event$.pipe(tap((res) => (this.event = res)));
  }
}
