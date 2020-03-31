import { Component, OnInit, Input } from "@angular/core";
import { Comment } from "../types/types";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styles: []
})
export class CommentComponent implements OnInit {
  @Input("comment") comment: Comment;
  constructor() {}

  ngOnInit() {}
}
