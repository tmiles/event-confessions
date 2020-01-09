import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Confession, Comment } from "../types/types";
import { DataService } from "../services/data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-confession",
  templateUrl: "./confession.component.html",
  styles: ["i.em { font-size: 12px; }"]
})
export class ConfessionComponent {
  @Input("confession") confession;
  @Output() clickReact: EventEmitter<string> = new EventEmitter();
  @Output() clickComment: EventEmitter<Comment> = new EventEmitter();
  showReactions = false;
  showComments = false;
  commentMessage = "";
  sentComment = false;
  showImage = false;
  reactionTypes = [
    { data: "heart", icon: "em em-heart_eyes" },
    { data: "smile", icon: "em em-laughing" },
    { data: "sad", icon: "em em-cry" },
    { data: "thumbs", icon: "em em---1" }
  ];

  constructor(private ds: DataService) {}

  react(type: string) {
    this.clickReact.emit(type);
  }

  comment() {
    const c: Comment = {
      message: this.commentMessage,
      dateApproved: null,
      dateCreated: new Date(),
      visible: false,
      id: 0 // where in array it is,
    };
    this.sentComment = true;
    this.commentMessage = "";
    this.clickComment.emit(c);
  }

  async reportConfession(confession: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "This will mark this confession as inappropriate.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Report Confession!"
    }).then(result => {
      if (result.value) {
        this.ds.reportConfession(confession.eventID, confession).then(val => {
          Swal.fire({
            title: "Feedback provided",
            text: "Thank you for providing your feedback!",
            type: "success"
          });
        });
      }
    });
  }
}
