import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "../services/data.service";
import { ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { Observable } from "rxjs";

@Component({
  selector: "app-admin-event-analytic",
  templateUrl: "./admin-event-analytic.component.html",
  styles: [],
})
export class AdminEventAnalyticComponent implements OnInit {
  @Input() event: any;
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
  event$: Observable<any> = null;
  eventAnalytics$: Observable<any> = null;
  eventAnalytics: any = null;
  analyticsSub = null;
  constructor(private d_s: DataService) {}

  ngOnInit(): void {
    if (this.event) {
      this.event$ = this.d_s.getEvent(this.event.id); // Might not need this, leave it up to the parent
      this.eventAnalytics$ = this.d_s.getEventStats(this.event.id);
      this.analyticsSub = this.eventAnalytics$.subscribe((res) => {
        this.eventAnalytics = res;
        this.updateCharts();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.analyticsSub) {
      this.analyticsSub.unsubscribe();
    }
  }

  async forceUpdate(eventID: string): Promise<boolean> {
    await this.d_s.summarizeData(eventID);
    return true;
  }

  async updateCharts(): Promise<boolean> {
    // pies
    this.pieChartData = [
      this.eventAnalytics.reactions.heart,
      this.eventAnalytics.reactions.smile,
      this.eventAnalytics.reactions.sad,
      this.eventAnalytics.reactions.thumbs,
    ];
    // bar
    return true;
  }
}
