import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-confession',
  templateUrl: './admin-confession.component.html',
  styles: [``]
})
export class AdminConfessionComponent {
  // @Input('confession') confession = null;
  // showComments = false;
  // constructor( private d_s: DataService ) { }

  // ngOnInit() {
  // }

  // moderateComment(event, id) {
  //   this.d_s.moderateComment(this.confession, id, event.checked);
  // }

  // seeChange(event, cid) {
  //   this.d_s.toggleConfession( this.confession.id, event.checked);
  // }

}
