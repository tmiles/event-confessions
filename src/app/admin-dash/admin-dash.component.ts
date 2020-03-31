import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { DataService } from "../services/data.service";
import { ChartType, ChartOptions } from "chart.js";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { Label } from "ng2-charts";

@Component({
  selector: "app-admin-dash",
  templateUrl: "./admin-dash.component.html",
  styles: [
    `
      .grayBg {
        background-color: #f1f1f1;
        border-radius: 10px;
        margin: 10px;
      }
    `
  ]
})
export class AdminDashComponent implements OnInit {
  events$: Observable<any[]> = null;
  eventStats: any = {};
  event: any = null;
  currentStats: any = null;
  eventID: string = null;
  allStats$: Observable<any> = null;
  createEvent: boolean = false;

  // Security

  authenticated: string = "";
  loginForm = new FormGroup({});
  loginModel: any = {};
  loginOptions: FormlyFormOptions = {};
  loginFields: FormlyFieldConfig[] = [
    {
      key: "pass",
      type: "input",
      templateOptions: {
        label: "Password",
        placeholder: "Entry Password",
        required: true
      }
    }
  ];
  public adminPassword: string = "superAdminPassword";

  // Pies
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "top"
    }
  };
  public pieChartLabels: Label[] = ["Hearts", "Smiles", "Sad", "Thumbs"];
  public pieChartData: number[] = [0, 0, 0, 0];
  public pieChartColors = [
    {
      backgroundColor: [
        "rgba(255,0,0,0.3)",
        "rgba(0,255,0,0.3)",
        "rgba(0,0,255,0.3)"
      ]
    }
  ];
  constructor(public d_s: DataService) {}

  ngOnInit() {
    this.events$ = this.d_s.getAllEvents(null);
    this.allStats$ = this.d_s.getEventStats("all");
    if (this.d_s.checkLocalPass("admin-dash")) {
      // If logged in within 7 days
      this.authenticated = "admin";
    }
  }

  passSecurity(value) {
    // if (event) {
    if (
      !this.adminPassword ||
      this.adminPassword === "" ||
      value === this.adminPassword
    ) {
      // logged in
      this.authenticated = "admin";
      this.d_s.assignLocalPass("admin-dash");
      return true;
    } else {
      this.authenticated = "";
      return false;
    }
  }

  async selectEvent(event: any): Promise<boolean> {
    this.eventID = event.id;
    this.event = event;
    this.currentStats = this.eventStats[this.eventID];
    return this.eventStats[this.eventID]
      ? this.updateCharts(this.eventID)
      : this.calculateScore(this.eventID);
  }

  async calculateScore(eventID: string): Promise<boolean> {
    // Check if document exists
    let stats = await this.d_s
      .getEventStats(eventID)
      .pipe(first())
      .toPromise();
    if (stats) {
      stats.lastUpdate = stats.lastUpdate.toDate();
      this.eventStats[eventID] = stats;
    } else {
      this.eventStats[eventID] = await this.d_s.summarizeData(eventID);
    }
    // Calculate if not
    this.currentStats = this.eventStats[eventID];
    return this.updateCharts(eventID);
  }

  async forceUpdate(eventID: string): Promise<boolean> {
    this.eventStats[eventID] = await this.d_s.summarizeData(eventID);
    this.currentStats = this.eventStats[eventID];
    return true;
  }

  async updateCharts(eventID: string): Promise<boolean> {
    // pies
    this.pieChartData = [
      this.currentStats.reactions.heart,
      this.currentStats.reactions.smile,
      this.currentStats.reactions.sad,
      this.currentStats.reactions.thumbs
    ];
    // bar
    return true;
  }
}
