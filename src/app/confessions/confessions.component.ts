import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAnalytics } from "@angular/fire/analytics";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Confession } from "../types/types";
import Swal from "sweetalert2";
import { first } from "rxjs/operators";

@Component({
  selector: "app-confessions",
  templateUrl: "./confessions.component.html",
  styleUrls: ["./confessions.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("400ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class ConfessionsComponent implements OnInit, AfterViewInit {
  // isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any | null;
  searchField = null;
  searchFields = [["to"], ["from"], ["message"]];
  form = new FormGroup({});
  loginModel: any = {};
  loggedIn = false;
  model: any = {};
  showConfirmation = false;
  sortField = "dateCreated";
  sortValue = "descending";

  pending = false;

  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
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

  eventID: string = null;
  event = null;
  sub = null;

  /* Table items */
  displayedColumns = ["dateCreated", "to", "from", "message"];
  displayedColumnsHeaders = ["Date", "To", "From", "Message"];
  dataSource: MatTableDataSource<any>;

  /* Confessions raw */
  confessions: any[] = null; // old system switch it out

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("myPond") myPond: any;

  lastUploadedPhoto = null;

  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Drop files here",
    allowFileSizeValidation: true,
    maxFileSize: 10000000,
    // allowImageValidateSize: true,
    // imageValidateSizeMaxWidth: 10000,
    // imageValidateSizeMaxHeight: 10000,
    acceptedFileTypes: "image/jpeg, image/png, image/gif"
  };

  // pondFiles = [
  //   'index.html'
  // ]

  constructor(
    private d_s: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private analytics: AngularFireAnalytics
  ) {
    analytics.logEvent("loaded", { loaded: true });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // todo load the correct event
      this.eventID = params["id"];
      this.analytics.updateConfig({ DEBUG_MODE: true });
      this.analytics.logEvent("event_open", { eid: this.eventID });
      this.analytics.logEvent("custom_event", { eid: this.eventID });
      console.log("Fired analytics");

      this.d_s
        .getEvent(this.eventID)
        .pipe(first())
        .toPromise()
        .then(res => {
          if (!res) {
            Swal.fire({
              icon: "error",
              title: "No event",
              text: "Confession Event not found",
              timer: 1500,
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: false
            }).then(() => {
              this.router.navigate(["../"], { relativeTo: this.route });
            });
          }
          this.event = res;
          // this.d_s.assignLocalPass(this.eventID); // for successful logins
          if (this.d_s.checkLocalPass(this.eventID)) {
            // If logged in within 2 days
            this.loggedIn = true; // bypass security
          }
          this.fetchData();
        });
    });
  }

  checkPass() {
    if (this.loginModel.pass === this.event.password) {
      this.loggedIn = true;
      return this.d_s.assignLocalPass(this.eventID);
    }
    return false;
  }

  /* File Upload */
  // pondHandleInit() {
  //   console.log("FilePond has initialised", this.myPond);
  // }

  async pondHandleAddFile(event: any) {
    if (event) {
      this.lastUploadedPhoto = this.myPond.getFile();
    }
  }

  async pondHandleRemoveFile(event: any) {
    this.lastUploadedPhoto = null;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.fetchData();
  }

  fetchData() {
    this.d_s.getConfessions(this.eventID, true).subscribe(res => {
      this.confessions = res;
    });
  }

  react(event, confession) {
    this.d_s.updateVotes(this.eventID, confession, event);
  }

  comment(e, confession) {
    this.d_s.commentConfession(this.eventID, confession, e);
  }

  openDialog(confession): void {
    console.log(confession);
    // const dialogRef = this.dialog.open(ConfessionDialogComponent, {
    //   width: '750px',
    //   data: {confession: confession, eventID: this.eventID}
    // });
  }

  submit() {
    this.pending = true;
    // let id =
    const data: Confession = {
      dateApproved: null,
      dateCreated: new Date(),
      from: this.model.from,
      to: this.model.to,
      message: this.model.message,
      score: 0,
      reaction: {
        heart: 0,
        sad: 0,
        smile: 0,
        thumbs: 0
      },
      id: null,
      visible: false,
      comments: [],
      commentCount: 0,
      commentPending: 0,
      status: "Pending Approval"
    };
    this.d_s
      .createConfession(this.eventID, data, null, this.lastUploadedPhoto)
      .then(() => {
        this.myPond.removeFiles();
        // this.showConfirmation = true;
        this.model = {};
        Swal.fire({
          title: "Submitted",
          text: "Submitted confession, pending admin approval",
          icon: "success"
        });
        this.pending = false;
        // clear image
      });
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
