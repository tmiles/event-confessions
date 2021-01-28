import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormlyFormOptions } from "@ngx-formly/core";
import Swal from "sweetalert2";
import { AnalyticsService } from "../services/analytics.service";
import { DataService } from "../services/data.service";
import { Confession } from "../types/types";

@Component({
  selector: "app-confession-create-modal",
  templateUrl: "./confession-create-modal.component.html",
  styles: [],
})
export class ConfessionCreateModalComponent implements OnInit {
  pending: boolean = false;
  eventID: string = null;
  model: any = {};
  lastUploadedPhoto: any = null;
  @ViewChild("myPond") myPond: any;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Drop files here",
    allowFileSizeValidation: true,
    maxFileSize: 10000000,
    // allowImageValidateSize: true,
    // imageValidateSizeMaxWidth: 10000,
    // imageValidateSizeMaxHeight: 10000,
    acceptedFileTypes: "image/jpeg, image/png, image/gif",
  };

  constructor(
    public d_s: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfessionCreateModalComponent>,
    private ans: AnalyticsService
  ) {
    this.eventID = this.data.eventID;
    // this.model = this.data.model;
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe((res) => {
      console.log("Closed by background");
      this.cancelDialog();
    });
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
        thumbs: 0,
      },
      id: null,
      visible: false,
      comments: [],
      commentCount: 0,
      commentPending: 0,
      status: "Pending Approval",
    };
    this.d_s
      .createConfession(this.eventID, data, null, this.lastUploadedPhoto)
      .then(() => {
        this.myPond.removeFiles();
        // this.showConfirmation = true;
        this.model = {};
        // TODO check if have any email sends, if so send email
        Swal.fire({
          title: "Submitted",
          text: "Submitted confession, pending admin approval",
          icon: "success",
        });
        this.pending = false;
        this.ans.logEvent("created", { eventID: this.eventID });
        // clear image
      });
  }

  async pondHandleAddFile(event: any) {
    if (event) {
      this.lastUploadedPhoto = this.myPond.getFile();
    }
  }

  async pondHandleRemoveFile(event: any) {
    this.lastUploadedPhoto = null;
  }

  cancelDialog(): void {
    if (this.model.to) {
      Swal.fire({
        title: "Delete confession",
        text: "Do you want to cancel confession?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel confession",
        cancelButtonText: "No, continue confession",
      }).then((result) => {
        if (result.value) {
          console.log("Closed out fields");
          this.model = {};
          this.dialogRef.close();
        }
      });
    }
    //   Swal.fire({
    //     title: "Delete confession",
    //     text: "Do you want to cancel confession?",
    //     icon: "warning",
    //     confirmButtonColor: "#DD6B55",
    //     cancelButtonColor: "#DD6B55",
    //     confirmButtonText: "Yes, cancel confession",
    //     cancelButtonText: "No, continue confession",
    //   }).then(() => {
    //     console.log("Closed out fields");
    //     this.model = {};
    //     this.dialogRef.close();
    //   });
    // }
    else {
      this.dialogRef.close();
    }
  }
}
