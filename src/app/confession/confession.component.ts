import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Confession, Comment } from "../types/types";
import { DataService } from "../services/data.service";
import Swal from "sweetalert2";
import { AnalyticsService } from "../services/analytics.service";

@Component({
  selector: "app-confession",
  templateUrl: "./confession.component.html",
  styles: [
    "i.em { font-size: 12px; }",
    `
      .mat-card-actions .mat-icon {
        color: #0336ff;
        font-size: 14px;
      }
    `,
  ],
})
export class ConfessionComponent {
  @Input("confession") confession;

  @Output() clickReact: EventEmitter<string> = new EventEmitter();
  @Output() clickComment: EventEmitter<Comment> = new EventEmitter();
  @Output() toggleFavorite: EventEmitter<boolean> = new EventEmitter();

  showReactions = false;
  showComments = false;
  commentMessage = "";
  sentComment = false;
  showImage = false;
  @Input() favorited: boolean = false;
  reactionTypes = [
    { data: "heart", icon: "em em-heart_eyes" },
    { data: "smile", icon: "em em-laughing" },
    { data: "sad", icon: "em em-cry" },
    { data: "thumbs", icon: "em em---1" },
  ];

  constructor(private ds: DataService, private ans: AnalyticsService) {}

  ngOnInit(): void {
    this.favorited = this.ds.ifFavorited(
      this.confession.eventID,
      this.confession.id
    )
      ? true
      : false;
  }

  react(type: string) {
    this.clickReact.emit(type);
  }

  comment() {
    const c: Comment = {
      message: this.commentMessage,
      dateApproved: null,
      dateCreated: new Date(),
      visible: false,
      id: 0, // where in array it is,
    };
    this.sentComment = true;
    this.commentMessage = "";
    this.clickComment.emit(c);
  }

  async reportConfession(confession: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "This will mark this confession as inappropriate.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Report Confession!",
    }).then((result) => {
      if (result.value) {
        this.ds.reportConfession(confession.eventID, confession).then((val) => {
          this.ans.logEvent("report", {
            eventID: confession.eventID,
            confessionID: confession.id,
          });
          Swal.fire({
            title: "Feedback provided",
            text: "Thank you for providing your feedback!",
            icon: "success",
          });
        });
      }
    });
  }

  async toggleFavoriteConfession(confession: any) {
    this.ds
      .toggleFavoriteConfession(confession.eventID, confession)
      .then((val) => {
        if (val) {
          this.ans.logEvent("favorite", {
            eventID: confession.eventID,
            confessionID: confession.id,
          });
          this.favorited = true;
          this.toggleFavorite.emit(true);
        } else {
          this.ans.logEvent("unfavorite", {
            eventID: confession.eventID,
            confessionID: confession.id,
          });
          this.favorited = false;

          this.toggleFavorite.emit(false);
        }
      });
  }
}
