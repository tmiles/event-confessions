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

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit, AfterViewInit {
  form = new FormGroup({});
  model: any = {};
  loginModel = null;
  authenticated: string = "";

  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: "pass",
      type: "input",
      templateOptions: {
        label: "Password",
        placeholder: "Admin Password",
        required: true
      }
    }
  ];

  eventID: string = null;
  event = null;
  sub = null;
  subscription = null;
  /* Table items */
  displayedColumns = ["dateCreated", "to", "status", "manage"];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
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
    this.route.params.subscribe(params => {
      // todo load the correct event
      this.eventID = params["id"];
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
              this.router.navigate(["../../"], { relativeTo: this.route });
            });
          }
          this.event = res;
          if (this.d_s.checkLocalPass(this.eventID + "-admin")) {
            // If logged in within 2 days
            this.authenticated = "edit";
          }
        });
      // this.subscription = this.d_s.getConfessionsAdmin(this.eventID, null, 'status').subscribe(res => {
      //   //   this.dataSource = new MatTableDataSource(res);
      //   // }

      //   this.dataSource.data = res;
      //   this.loaded = true;
      //   this.dataSource.paginator = this.paginator;
      //   this.applyFilter('');
      //   // setTimeout(() => {
      //   //   this.dataSource.paginator = this.paginator; console.log('Complete');
      //   // }, 2000);
      //   this.dataSource.sort = this.sort;
      //   // console.log('Sorted');
      // });
      this.fetchData();
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
      .subscribe(res => {
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
        auth: this.authenticated
      }
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
}
