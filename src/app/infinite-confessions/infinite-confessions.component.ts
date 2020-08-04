import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, BehaviorSubject } from "rxjs";
import { map, tap, scan, mergeMap, throttleTime } from "rxjs/operators";
import { Confession } from "../types/types";
import * as faker from "faker";
import { DataService } from "../services/data.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "app-infinite-confessions",
  templateUrl: "./infinite-confessions.component.html",
  styles: [],
})
export class InfiniteConfessionsComponent implements AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport: CdkVirtualScrollViewport;

  batch = 20;
  theEnd = false;

  offset = new BehaviorSubject(null);
  confession_s: Observable<any[]>;
  showConfirmation = false;
  eventName: string = null;

  form = new FormGroup({});
  model: any = {
    from: null,
  };
  options: FormlyFormOptions = {};
  event = null;

  /* PASSWORD */
  passForm = new FormGroup({});
  passModel: any = {};

  passOptions: FormlyFormOptions = {};
  passFields: FormlyFieldConfig[] = [
    {
      key: "pass",
      type: "input",
      templateOptions: {
        label: "Password",
        placeholder: "Entry Password",
        required: true,
      },
    },
  ];

  constructor(
    private db: AngularFirestore,
    private d_s: DataService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      // todo load the correct event
      this.eventName = params["id"];
      this.db
        .collection("events")
        .doc(this.eventName)
        .valueChanges()
        .subscribe((res) => {
          this.event = res;
        });

      const batchMap = this.offset.pipe(
        throttleTime(500),
        mergeMap((n) => this.getBatch(n)),
        scan((acc, batch) => {
          return { ...acc, ...batch };
        }, {})
      );
      this.confession_s = batchMap.pipe(map((v) => Object.values(v)));
    });
  }

  ngAfterViewInit() {
    if (this.event) {
      this.options = this.event.submitForm;
    }
  }
  react(event, confession) {
    this.d_s.updateVotes(this.eventName, confession, event);
  }

  comment(e, confession) {
    this.d_s.commentConfession(this.eventName, confession, e);
  }

  getBatch(offset) {
    // console.log(offset);
    return this.db
      .collection("events")
      .doc(this.eventName)
      .collection("confessions", (ref) =>
        ref.orderBy("dateCreated").startAfter(offset).limit(this.batch)
      )
      .snapshotChanges()
      .pipe(
        tap((arr) => (arr.length ? null : (this.theEnd = true))),
        map((arr) => {
          return arr.reduce((acc, cur) => {
            const id = cur.payload.doc.id;
            const data = cur.payload.doc.data();
            return { ...acc, [id]: data };
          }, {});
        })
      );
  }

  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    // console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i) {
    return i;
  }

  submit() {
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
      status: "Pending Approval",
    };
    if (this.d_s.createConfession(this.eventName, data, null, null)) {
      this.showConfirmation = true;
      this.options.resetModel(); // clear out the form
    }
  }
}
