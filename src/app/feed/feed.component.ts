import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styles: [],
})
export class FeedComponent implements OnInit {
  // Read local storage for preferences
  // Determine which events authorized
  // Determine liked posts (get subscriptions of them)
  constructor() {}

  ngOnInit(): void {}
}
