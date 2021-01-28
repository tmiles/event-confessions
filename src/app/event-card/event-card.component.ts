import { Component, Input, OnInit } from "@angular/core";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styles: [],
})
export class EventCardComponent implements OnInit {
  public icons = {
    heart: faHeart,
  };
  @Input() eventID: string = null;
  @Input("event") confessionEvent: any = null;
  constructor() {}

  ngOnInit(): void {
    if (!event && this.eventID) {
      // access the data
      this.confessionEvent = {};
    }
  }
}
