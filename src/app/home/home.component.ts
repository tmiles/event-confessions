import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `
  mat-card {
    width: 95%;
    margin: 10px auto;
  }`]
})
export class HomeComponent implements OnInit {
  events$: Observable<any[]> = null;
  homeData$: Observable<any> = null;
  public versionNumber = "6.0.0";

  constructor(
    private ds: DataService
    ) { }

  ngOnInit(){
    this.events$ = this.ds.getAllEvents(true);
    this.homeData$ = this.ds.getHomeData();
  }
}
