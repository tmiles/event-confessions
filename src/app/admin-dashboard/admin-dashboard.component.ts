import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { DataService } from "../services/data.service";
import { ChartOptions } from "chart.js";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { Label } from "ng2-charts";
import { AnalyticsService } from "../services/analytics.service";
import {
  faHome,
  faPlusCircle,
  faFileDownload,
  faEnvelopeOpenText,
  faComments,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faChartBar } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  icons = {
    home: faHome,
    pending: faClock,
    create: faPlusCircle,
    reports: faChartBar,
    export: faFileDownload,
    email: faEnvelopeOpenText,
    events: faComments,
    settings: faCogs,
  };
  events$: Observable<any[]> = null;
  eventStats: any = {};
  event: any = null;
  currentStats: any = null;
  eventID: string = null;
  homeData: any = null;
  allStats$: Observable<any> = null;
  createEvent: boolean = false;
  currentDash: string = "home";

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
        required: true,
      },
    },
  ];
  public adminPassword: string = "superAdminPassword";

  // Pies
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "top",
    },
  };
  public pieChartLabels: Label[] = ["Hearts", "Smiles", "Sad", "Thumbs"];
  public pieChartData: number[] = [0, 0, 0, 0];
  public pieChartColors = [
    {
      backgroundColor: [
        "rgba(255,0,0,0.3)",
        "rgba(0,255,0,0.3)",
        "rgba(0,0,255,0.3)",
      ],
    },
  ];
  constructor(public d_s: DataService, private ans: AnalyticsService) {}

  async ngOnInit() {
    this.homeData = await this.d_s.getHomeData().pipe(first()).toPromise();
    this.adminPassword = this.homeData
      ? this.homeData.adminPassword
      : this.adminPassword;
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
    let stats = await this.d_s.getEventStats(eventID).pipe(first()).toPromise();
    this.ans.logEvent("request_analytics");
    if (stats) {
      stats.lastUpdate = stats.lastUpdate.toDate();
      this.eventStats[eventID] = stats;
    } else {
      this.eventStats[eventID] = await this.d_s.summarizeData(eventID);
      this.ans.logEvent("ran_analytics", {
        eventID: this.eventID,
      });
    }
    // Calculate if not
    this.currentStats = this.eventStats[eventID];

    return this.updateCharts(eventID);
  }

  async forceUpdate(eventID: string): Promise<boolean> {
    this.eventStats[eventID] = await this.d_s.summarizeData(eventID);
    this.ans.logEvent("ran_analytics", {
      eventID: this.eventID,
    });
    this.currentStats = this.eventStats[eventID];
    return true;
  }

  async updateCharts(eventID: string): Promise<boolean> {
    // pies
    this.pieChartData = [
      this.currentStats.reactions.heart,
      this.currentStats.reactions.smile,
      this.currentStats.reactions.sad,
      this.currentStats.reactions.thumbs,
    ];

    // bar
    return true;
  }

  navigateDash(dashName: string) {
    this.currentDash = dashName;
    // TODO render out new content (might just be in the template tbh)
  }

  // TODO new function to moderate brand new events, include a timestamp for when moderated
  // TODO if moderating new, then send a welcome email
}
