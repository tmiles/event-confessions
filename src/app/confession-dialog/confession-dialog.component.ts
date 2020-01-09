import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-confession-dialog",
  templateUrl: "./confession-dialog.component.html",
  styles: [``]
})
export class ConfessionDialogComponent implements OnInit {
  reactionTypes = [
    { data: "heart", icon: "em em-heart_eyes" },
    { data: "smile", icon: "em em-laughing" },
    { data: "sad", icon: "em em-cry" },
    { data: "thumbs", icon: "em em---1" }
  ];

  comments = null;
  approved: any[];
  pending: any[];
  eventID: string;
  confession: any;
  showImage = false;
  auth: string;
  constructor(
    public d_s: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfessionDialogComponent>
  ) {}

  ngOnInit() {
    this.eventID = this.data.eventID;
    this.confession = this.data.confession;
    this.auth = this.data.auth;
    this.comments = this.confession.comments;
    this.approved = this.comments.filter(res => res.visible);
    this.pending = this.comments.filter(res => !res.visible);
  }

  moderateComment(id, approve: boolean) {
    this.d_s.moderateComment(this.eventID, this.confession, id, approve).then((val) => {
      this.confession.visible = approve;
    });
  }

  moderateConfession(id, approve: boolean) {
    this.confession.visible = approve;
    this.confession.dateApproved = approve ? new Date() : null;

    this.d_s
      .updateConfession(this.eventID, this.confession.id, this.confession)
      .then(() => {
        this.dialogRef.close();
      });
  }
}
