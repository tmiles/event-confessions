import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styles: [
    `
      mat-card {
        width: 95%;
        margin: 10px auto;
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  homeData$: Observable<any> = null;
  homeData: any = null;
  eventsArray: any[] = null;
  events: any = null;
  versionNumber: string;
  private sub: any;

  constructor(private ds: DataService) {}

  ngOnInit() {
    this.versionNumber = this.ds.versionNumber;
    this.homeData$ = this.ds.getHomeData();
    this.sub = this.homeData$.subscribe((res) => {
      this.homeData = res;
      this.events = res ? res.events : null;
      if (this.events) {
        this.eventsArray = this.ds
          .toArray(this.events)
          .filter((el) => el.active);
        this.eventsArray.sort((a, b) => {
          return b["dateCreated"].seconds - a["dateCreated"].seconds;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
