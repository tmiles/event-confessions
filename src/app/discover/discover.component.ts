import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.component.html",
  styles: [
    `
      .flex-row.col3 > * {
        margin: 8px;
        max-width: 262.685px;
      }
    `,
    `
      .flex-row.col3 > * {
        flex: 1;
      }
    `,
    `
      .flex-row.col4 > * {
        width: calc(25% - 20px);
        margin: 10px;
      }
    `,
    `
      input.searchBar {
        width: 100%;
        height: 2rem;
      }
    `,
  ],
})
export class DiscoverComponent implements OnInit {
  searchField: string = "";
  events$: Observable<any[]> = null;
  featured$: Observable<any[]> = null;
  featuredEvents$: Observable<any[]> = null;
  recentEvents$: Observable<any[]> = null;
  searchFields = [["organization"], ["formal_name"], ["id"]];
  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.events$ = this.ds.getAllEvents(true);
    this.recentEvents$ = this.ds.getAllEvents(true);
  }
}
