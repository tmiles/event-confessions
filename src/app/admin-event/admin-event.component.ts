import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ConfessionDialogComponent } from "../confession-dialog/confession-dialog.component";
import Swal from "sweetalert2";
import { first } from "rxjs/operators";
import {
  faHome,
  faPlusCircle,
  faFileDownload,
  faEnvelopeOpenText,
  faComments,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faChartBar } from "@fortawesome/free-regular-svg-icons";
import { ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { Observable } from "rxjs";

@Component({
  selector: "app-event-admin",
  templateUrl: "./admin-event.component.html",
  styleUrls: ["./admin-event.component.css"],
})
export class AdminEventComponent implements OnInit, AfterViewInit {
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
  form = new FormGroup({});
  model: any = {};
  loginModel = null;
  authenticated: string = "";

  currentDash: string = "home";

  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: "pass",
      type: "input",
      templateOptions: {
        label: "Password",
        placeholder: "Admin Password",
        required: true,
      },
    },
  ];

  eventID: string = null;
  event = null;
  sub = null;
  subscription = null;

  currentStats: any = null;
  /* Table items */
  displayedColumns = ["dateCreated", "to", "status"];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  allConfessions: any = null;
  liveAnalytics: any = {};
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

  adminHelp$: Observable<{
    articles: { title: string; html: string }[];
  }> = null;

  // Forms
  passwordForm = new FormGroup({});
  passwordFields = [{}];
  passwordsModel = [{}];

  eventForm = new FormGroup({});
  eventFields = [{}];
  eventModel = [{}];

  // matPaginator

  // private paginator: MatPaginator;
  // private sort: MatSort;

  // @ViewChild(MatSort) set matSort(ms: MatSort) {
  //   this.sort = ms;
  //   this.setDataSourceAttributes();
  // }

  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }

  constructor(
    private d_s: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // todo load the correct event
      this.eventID = params["id"];
      this.d_s
        .getEvent(this.eventID)
        .pipe(first())
        .toPromise()
        .then((res) => {
          if (!res) {
            Swal.fire({
              icon: "error",
              title: "No event",
              text: "Confession Event not found",
              timer: 1500,
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: false,
            }).then(() => {
              this.router.navigate(["../../"], { relativeTo: this.route });
            });
          }
          this.event = res;
          this.adminHelp$ = this.d_s.getDocument("configs/admin-help");

          this.initializeForms();
          if (this.d_s.checkLocalPass(this.eventID + "-admin")) {
            // If logged in within 2 days
            this.authenticated = "edit";
          }
        });
      this.fetchData();
    });
  }

  initializeForms() {
    let formFields = this.d_s.createEventFields;
    this.passwordFields = [
      formFields[0].fieldGroup[1].fieldGroup[0],
      formFields[0].fieldGroup[1].fieldGroup[1],
      formFields[0].fieldGroup[1].fieldGroup[2],
    ];
    this.eventFields = [
      formFields[0].fieldGroup[0].fieldGroup[0],
      formFields[0].fieldGroup[0].fieldGroup[1],
      formFields[0].fieldGroup[2].fieldGroup[0],
      formFields[0].fieldGroup[2].fieldGroup[1],
    ];
    this.passwordsModel = this.eventModel = this.event;
  }

  navigateDash(dashName: string) {
    this.currentDash = dashName;
    // TODO render out new content (might just be in the template tbh)
  }

  updateEvent() {
    this.d_s.createEvent(this.event.id, this.event).then(() => {
      Swal.fire({
        title: "Updated",
        text: "Event details have been updated!",
        icon: "success",
      });
    });
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.applyFilter("");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // console.log('Started')
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 10000);
  }

  fetchData() {
    // if (this.subscription != null) {
    //   this.subscription.unsubscribe();
    // }
    this.subscription = this.d_s
      .getConfessions(this.eventID, null)
      .subscribe((res) => {
        this.liveAnalytics = this.calculateLiveAnalytics(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.paginator.firstPage();
        this.dataSource.sort = this.sort;
      });
    // if (this.subscription && this.dataSource) {
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.paginator.firstPage();
    // }
  }

  openDialog(confession): void {
    const dialogRef = this.dialog.open(ConfessionDialogComponent, {
      width: "750px",
      data: {
        confession: confession,
        eventID: this.eventID,
        auth: this.authenticated,
      },
    });
  }

  passSecurity(value) {
    // if (event) {
    if (!this.event["adminPassword"] || value === this.event["adminPassword"]) {
      // logged in
      this.fetchData();
      this.authenticated = "edit";
      this.d_s.assignLocalPass(this.eventID + "-admin");
      return true;
    } else if (
      this.event["adminViewPassword"] &&
      value === this.event["adminViewPassword"]
    ) {
      this.fetchData();
      this.authenticated = "view";
      return true;
    } else {
      this.authenticated = "";
      return false;
    }
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }

  calculateLiveAnalytics(allData) {
    let analytics = {
      total: allData.length,
      totalApproved: 0,
      totalRejected: 0,
      totalPending: 0,
      totalReported: 0,
      totalComments: 0,
      totalReactions: 0,
      dayApproved: 0,
      dayRejected: 0,
      dayPending: 0,
      dayReported: 0,
      dayComments: 0,
      dayReactions: 0,
    };
    allData.forEach((el) => {
      if (el.status.toLowerCase() === "pending approval") {
        // Do day check
        this.liveAnalytics.totalPending++;
      } else if (el.status.toLowerCase() === "not approved") {
        // Do day check
        this.liveAnalytics.totalRejected++;
      } else {
        if (el.dateApproved) {
          // Do day check
          this.liveAnalytics.totalApproved++;
        }
      }
      if (el.reportCount > 0) {
        // Do day check
        this.liveAnalytics.totalReported++;
      }
    });
    return analytics;
  }
}
