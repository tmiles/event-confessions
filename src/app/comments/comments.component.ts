import { Component, OnInit, Input } from '@angular/core';
import { Confession, Comment} from '../types/types';

@Component({
  selector: 'app-comments',
  template: `
    <app-comment *ngFor="let item of confession.comments" [comment]="item"></app-comment>
  `,
  styles: [],
})
export class CommentsComponent implements OnInit {
  @Input('confession') confession: Confession; // to access the 
  
  constructor() { }

  ngOnInit() {
  }

}
