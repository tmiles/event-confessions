import { Injectable, Inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import {
  map,
  tap,
  scan,
  mergeMap,
  throttleTime,
  take,
  first,
  finalize
} from "rxjs/operators";
import { Confession, Comment } from "../types/types";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root"
})
export class DataService {
  public recent: Observable<Confession[]> = null;
  public all: Observable<Confession[]> = null;

  constructor(
    private db: AngularFirestore,
    private afstore: AngularFireStorage
  ) {
    // this.summarizeData("sww20").then();
    // this.duplicateDoc('events/sw-apex-4', 'events/u-16');
    // this.duplicateCollection('events/summit-12/confessions', 'events/summit-13/confessions');
    // this.collectionUpdate('events/summit-13/confessions');
    // this.recent = this.limit('confessions', 'desc', 20, true);
    // this.all = this.limit('confessions', 'desc', 20);
  }

  /**
   * Builder for search fields, dynamics (2-D array input)
   * @param input the data
   * @param fields what are the fields you can search for (isn't exclusive filtering)
   * @param text text to look for
   */
  searchFields(input: any, fields: any[], text: string): boolean {
    let check = false;
    // goes through the array of fields
    fields.forEach(val => {
      let value = input;
      if (val.length > 1) {
        // if it's a nested array
        val.forEach((arrVal: string) => {
          // 'name', 'display'
          console.log(arrVal);
          if (arrVal && value[arrVal]) {
            // ensure the key exists
            value = value[arrVal]; // calculate the data value
          }
        });
      } else {
        value = value[val[0]];
      }
      // boolean stringing
      const attributeValue = value ? value.toLowerCase().includes(text) : null;
      check = check || attributeValue;
    });
    return check;
  }

  async createEvent(eventID: string, data: any) {
    // check if data

    let check = await this.getEvent(eventID)
      .pipe(first())
      .toPromise();
    if (check) {
      return this.db
        .doc(`events/${eventID}`)
        .update(Object.assign({}, data))
        .then(() => {
          return Promise.resolve(`Updated eventID: ${eventID}`);
        });
    } else {
      // other data
      data = {
        ...data,
        active: false,
        dateCreated: new Date(),
        submitForm: [
          {
            key: "to",
            templateOptions: {
              lable: "To",
              placeholder: "Who is this to?",
              required: true
            },
            type: "input"
          },
          {
            hideExpression: "!model.to",
            key: "from",
            templateOptions: {
              label: "From",
              placeholder: "Who is writing this (optional)?"
            },
            type: "input"
          },
          {
            hideExpression: "!model.to",
            key: "message",
            templateOptions: {
              label: "Message",
              placeholder: "What do you want to say to them?",
              required: true
            },
            type: "input"
          }
        ]
      };
      return this.db
        .doc(`events/${eventID}`)
        .set(Object.assign({}, data))
        .then(() => {
          return Promise.resolve(`Created eventID: ${eventID}`);
        });
    }
  }

  async createConfession(
    eventName: string,
    data: any,
    id: string,
    file: any
  ): Promise<void> {
    data.dateCreated = new Date(data.dateCreated);
    id = id ? id : this.db.createId();
    id = `${data.dateCreated.toISOString()}-${id}`;
    data.id = id;
    data.reportCount = 0;
    data.eventID = eventName;
    if (file) {
      // upload here then do other stuff
      await this.uploadFile(eventName, file, id).then(val => {
        data.fileURL = val;
        const newData = JSON.parse(JSON.stringify(data));
        return this.db
          .doc(`events/${eventName}/confessions/${id}`)
          .set(Object.assign({}, newData));
      });
      // data.file = // assign the path once done uploading
    }
    const newData = JSON.parse(JSON.stringify(data));
    // console.log(data);
    return this.db
      .doc(`events/${eventName}/confessions/${id}`)
      .set(Object.assign({}, newData));
  }

  updateConfession(eventID, id, data: Confession): Promise<void> {
    // recalculate the reactions
    let total = 0;
    total += data.reaction.smile;
    total += data.reaction.heart;
    total += data.reaction.thumbs;
    total += data.reaction.sad;

    data.score = total;
    if (!data.visible) {
      data.status = "Not Approved";
    } else if (data.commentPending > 0) {
      data.status = "Pending Comments";
    } else if (data.commentPending === 0) {
      data.status = "";
    } else {
      data.status = "";
    }
    return this.db.doc("events/" + eventID + "/confessions/" + id).update(data);
  }

  toggleConfession(id: string, toggle: boolean): boolean {
    let da = null;
    if (toggle) {
      da = Date.now();
    }
    this.db
      .doc("confessions/" + id)
      .update({ visible: toggle, dateApproved: da });
    return true;
  }

  react(c, type, op) {
    if (type === "smile") {
      if (op === "plus") {
        c.reaction.smile++;
      } else {
        c.reaction.smile--;
      }
    } else if (type === "heart") {
      if (op === "plus") {
        c.reaction.heart++;
      } else {
        c.reaction.heart--;
      }
    } else if (type === "sad") {
      if (op === "plus") {
        c.reaction.sad++;
      } else {
        c.reaction.sad--;
      }
    } else if (type === "thumbs") {
      if (op === "plus") {
        c.reaction.thumbs++;
      } else {
        c.reaction.thumbs--;
      }
    } else {
      return null;
    }
    return c;
  }
  updateVotes(eventID, confession, voteType: string): Promise<void> {
    const dat = JSON.parse(localStorage.getItem(confession.id));
    if (dat) {
      // change vote type or remove vote
      confession = this.react(confession, dat, "sub"); // subtract old vote
      localStorage.setItem(confession.id, null);
      if (voteType !== dat) {
        // reassign vote
        confession = this.react(confession, voteType, "plus"); // assigns new one
        localStorage.setItem(confession.id, JSON.stringify(voteType)); // reassign vote
      }
    } else {
      // haven't voted yet for this one
      localStorage.setItem(confession.id, JSON.stringify(voteType)); // remember what vote type it is
      confession = this.react(confession, voteType, "plus");
    }
    return this.updateConfession(eventID, confession.id, confession);
  }

  commentConfession(eventID, confession: Confession, comment: Comment) {
    if (!confession.comments || confession.comments.length === 0) {
      confession.comments = []; // assign blank
      confession.commentCount = 0;
      confession.commentPending = 0;
    }
    comment.id = confession.comments.length;
    confession.comments.push(comment);
    confession.commentPending++; // added one more
    confession.commentCount =
      confession.comments.length - confession.commentPending; // amount available to see
    this.updateConfession(eventID, confession.id, confession);
    return true;
  }

  moderateComment(
    eventID,
    confession: Confession,
    commentID: number,
    approved: boolean
  ): Promise<void> {
    confession.comments[commentID].visible = approved; // does the toggling of visibility
    if (approved) {
      // getting approved
      confession.comments[commentID].dateApproved = new Date();
      confession.commentPending--; // added one more
    } else {
      // not approved
      confession.commentPending++; // remove the initial one added, then subtract one
      confession.comments[commentID].dateApproved = null;
    }
    confession.commentCount =
      confession.comments.length - confession.commentPending; // recalculate the count
    return this.updateConfession(eventID, confession.id, confession);
  }

  limit(collection: string, order: any, amount: number, visible?: boolean) {
    if (visible === undefined) {
      return this.db
        .collection<Confession>(collection, ref =>
          ref.orderBy("dateCreated", order).limit(amount)
        )
        .valueChanges();
    }
    return this.db
      .collection<Confession>(collection, ref =>
        ref
          .where("visible", "==", visible)
          .orderBy("dateCreated", order)
          .limit(amount)
      )
      .valueChanges();
  }

  /* Access functions */
  getConfig(eventName: string): Observable<any> {
    return this.db
      .collection("events")
      .doc(eventName)
      .valueChanges();
  }

  getConfessions(eventName: string, approved: boolean): Observable<any> {
    if (approved == null) {
      return this.db
        .collection(`events/${eventName}/confessions`)
        .valueChanges();
    } else {
      return this.db
        .collection(`events/${eventName}/confessions`, ref => {
          return ref
            .where("visible", "==", approved)
            .orderBy("dateCreated", "desc");
        })
        .valueChanges();
    }
  }

  getConfessionsAdmin(
    eventName: string,
    approved: boolean,
    orderBy: string
  ): Observable<any> {
    if (approved == null) {
      return this.db
        .collection(`events/${eventName}/confessions`, ref =>
          ref.orderBy(orderBy, "desc")
        )
        .valueChanges();
    } else {
      return this.db
        .collection(`events/${eventName}/confessions`, ref => {
          return ref.where("visible", "==", approved).orderBy("status", "desc");
        })
        .valueChanges();
    }
  }

  getHomeData(): Observable<any> {
    return this.db
      .collection("configs")
      .doc("home")
      .valueChanges();
  }

  getEvent(eventName: string): Observable<any> {
    return this.db
      .collection("events")
      .doc(eventName)
      .valueChanges();
  }

  getEventStats(eventID: string): Observable<any> {
    return this.db
      .collection("summaries")
      .doc(eventID)
      .valueChanges();
  }

  getAllEvents(active: boolean): Observable<any[]> {
    if (active === null) {
      return this.db.collection(`events`).valueChanges();
    }

    return this.db
      .collection(`events`, ref =>
        ref.where("active", "==", active).orderBy("dateCreated", "desc")
      )
      .valueChanges();
  }
  /**
   * @todo move to. cloud function or /api end point (proof of concept here)
   */
  async getAllEventStats(): Promise<any> {
    let data = {
      events: {},
      lastUpdate: new Date(),
      stats: {
        events: 0,
        confessions: { total: 0, accepted: 0, rejected: 0 },
        comments: { total: 0, accepted: 0, rejected: 0, commented: 0 },
        reactions: {
          total: 0,
          heart: 0,
          sad: 0,
          smile: 0,
          thumbs: 0,
          scored: 0
        },
        averages: {
          confessions: 0,
          comments: 0,
          reactions: 0,
          heart: 0,
          sad: 0,
          smile: 0,
          thumbs: 0,
          acceptRate: 0,
          commentRate: 0
        }
      },
      id: "all"
    };
    let events = await this.db
      .collection("events", ref => ref.where("active", "==", true))
      .get()
      .pipe(first())
      .toPromise();
    for await (let ev of events.docs) {
      let estats = await this.getEventStats(ev.id)
        .pipe(first())
        .toPromise();
      if (!estats) {
        // run stats here
        estats = await this.summarizeData(ev.id);
      }
      data.events[ev.id] = {
        stats: estats
      };
    }
    data.stats.events = Object.keys(data.events).length;

    // Iterate through all the events
    Object.keys(data.events).forEach(eid => {
      let edata = data.events[eid].stats;
      data.stats.confessions.total += edata.confessions.total;
      data.stats.confessions.accepted += edata.confessions.accepted;
      data.stats.confessions.rejected += edata.confessions.rejected;

      data.stats.comments.total += edata.comments.total;
      data.stats.comments.accepted += edata.comments.accepted;
      data.stats.comments.rejected += edata.comments.rejected;
      data.stats.comments.commented += edata.comments.commented;

      data.stats.reactions.total += edata.reactions.total;
      data.stats.reactions.heart += edata.reactions.heart;
      data.stats.reactions.sad += edata.reactions.sad;
      data.stats.reactions.smile += edata.reactions.smile;
      data.stats.reactions.thumbs += edata.reactions.thumbs;
      data.stats.reactions.scored += edata.reactions.scored;
    });

    data.stats.averages.confessions =
      data.stats.confessions.total / data.stats.events;
    data.stats.averages.comments =
      data.stats.comments.total / data.stats.comments.commented;
    data.stats.averages.reactions =
      data.stats.reactions.total / data.stats.confessions.accepted;
    data.stats.averages.heart =
      data.stats.reactions.heart / data.stats.reactions.scored;
    data.stats.averages.sad =
      data.stats.reactions.sad / data.stats.reactions.scored;
    data.stats.averages.smile =
      data.stats.reactions.smile / data.stats.reactions.scored;
    data.stats.averages.thumbs =
      data.stats.reactions.thumbs / data.stats.reactions.scored;
    data.stats.averages.commentRate =
      data.stats.comments.accepted / data.stats.comments.total;
    data.stats.averages.acceptRate =
      data.stats.confessions.accepted / data.stats.confessions.total;
    await this.db
      .doc("summaries/all")
      .set(Object.assign({}, data), { merge: true });
    console.log(data);
    return data;
  }

  async updateEventSummary(): Promise<any> {
    let data = {
      events: {},
      lastUpdate: new Date(),
      stats: {
        confessions: { total: 0, accepted: 0, rejected: 0 },
        comments: { total: 0, accepted: 0, rejected: 0, commented: 0 },
        reactions: {
          total: 0,
          heart: 0,
          sad: 0,
          smile: 0,
          thumbs: 0,
          scored: 0
        },
        averages: {
          comments: 0,
          reactions: 0,
          heart: 0,
          sad: 0,
          smile: 0,
          thumbs: 0,
          acceptRate: 0,
          commentRate: 0
        }
      },
      id: "all"
    };
    let events = await this.db
      .collection("events", ref => ref.where("active", "==", true))
      .get()
      .pipe(first())
      .toPromise();
    events.forEach(
      ev =>
        async function() {
          let estats = await this.getEventStats(ev.id)
            .pipe(first())
            .toPromise();
          if (!estats) {
            // run stats here
            estats = await this.summarizeData(ev.id);
          }
          events[ev.id] = {
            stats: estats
          };
        }
    );
    // Iterate through all the events
    Object.keys(data.events).forEach(eid => {
      let edata = data.events[eid];
      data.stats.confessions.total += edata.confessions.total;
      data.stats.confessions.accepted += edata.confessions.accepted;
      data.stats.confessions.rejected += edata.confessions.rejected;

      data.stats.comments.total += edata.comments.total;
      data.stats.comments.accepted += edata.comments.accepted;
      data.stats.comments.rejected += edata.comments.rejected;
      data.stats.comments.commented += edata.comments.commented;

      data.stats.reactions.total += edata.reactions.total;
      data.stats.reactions.heart += edata.reactions.heart;
      data.stats.reactions.sad += edata.reactions.sad;
      data.stats.reactions.smile += edata.reactions.smile;
      data.stats.reactions.thumbs += edata.reactions.thumbs;
      data.stats.reactions.scored += edata.reactions.scored;
    });

    data.stats.averages.comments =
      data.stats.comments.total / data.stats.comments.commented || 0;
    data.stats.averages.reactions =
      data.stats.reactions.total / data.stats.confessions.accepted;
    data.stats.averages.heart =
      data.stats.reactions.heart / data.stats.reactions.scored;
    data.stats.averages.sad =
      data.stats.reactions.sad / data.stats.reactions.scored;
    data.stats.averages.smile =
      data.stats.reactions.smile / data.stats.reactions.scored;
    data.stats.averages.thumbs =
      data.stats.reactions.thumbs / data.stats.reactions.scored;
    data.stats.averages.commentRate =
      data.stats.comments.accepted / data.stats.comments.total || 0;
    data.stats.averages.acceptRate =
      data.stats.confessions.accepted / data.stats.confessions.total || 0;
  }

  checkEvent(eventName: string) {
    return this.db
      .collection("events")
      .doc(eventName)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  /** local storage */
  assignLocalPass(eventID: string): boolean {
    let events = JSON.parse(localStorage.getItem(`events`)) || {};
    events[eventID] = new Date();
    localStorage.setItem("events", JSON.stringify(events));
    return true;
  }

  checkLocalPass(eventID: string, expLength: number = 7): boolean {
    let events = JSON.parse(localStorage.getItem(`events`)) || {};
    if (!events || !events[eventID]) {
      return false;
    }
    return new Date(events[eventID]).getDate() - new Date().getDate() >=
      expLength
      ? false
      : true;
  }

  /* Helper function */
  writeFirebase(collection: string, doc: string, data) {
    this.db
      .collection(collection)
      .doc(doc)
      .update(data)
      .then(() => console.log("Updated"));
  }

  async loadEvent(path: string) {
    const doc = await this.checkEvent(path);

    if (doc) {
      // Additional items
      return this.db
        .collection("events")
        .doc(path)
        .valueChanges();
    } else {
      console.log("Unable to find");
      // TODO redirect to home page
      return null;
    }
  }

  getBatch(offset, eventName: string, batch: number): any {
    let end = false;
    return {
      end: end,
      result: this.db
        .collection("events")
        .doc(eventName)
        .collection("confessions", ref =>
          ref
            .orderBy("id")
            .startAfter(offset)
            .limit(batch)
        )
        .snapshotChanges()
        .pipe(
          tap(arr => (arr.length ? null : (end = true))),
          map(arr => {
            return arr.reduce((acc, cur) => {
              const id = cur.payload.doc.id;
              const data = cur.payload.doc.data();
              return { ...acc, [id]: data };
            }, {});
          })
        )
    };
  }
  /* Dev */
  duplicateDoc(original: string, newAddress: string) {
    this.db
      .doc(original)
      .valueChanges()
      .subscribe(res => {
        console.log(res);
        return this.db.doc(newAddress).set(Object.assign({}, res));
      });
  }

  duplicateCollection(original: string, newAddress: string) {
    let counter = 0;
    this.db
      .collection(original)
      .valueChanges()
      .subscribe(res => {
        res.forEach(res1 => {
          if (counter < 5) {
            this.db
              .doc(`${newAddress}/${res1["id"]}`)
              .set(Object.assign({}, res1))
              .then(() => {
                counter++;
                console.log("Finished: " + counter);
              });
          }
        });
      });
  }

  collectionUpdate(original) {
    let counter = 0;
    this.db
      .collection(original)
      .valueChanges()
      .subscribe(res => {
        res.forEach(res1 => {
          res1["commentPending"] = res1["commentPending"]
            ? res1["commentPending"]
            : 0;
          res1["commentCount"] = res1["commentCount"]
            ? res1["commentCount"]
            : 0;
          this.db
            .doc(`${original}/${res1["id"]}`)
            .update(
              Object.assign(
                {},
                {
                  commentPending: res1["commentPending"],
                  commentCount: res1["commentCount"]
                }
              )
            )
            .then(() => {
              counter++;
              console.log("Finished: " + counter);
            });
        });
      });
  }

  uploadFile(eventID: string, data: any, id: string) {
    return new Promise((resolve, reject) => {
      // const file = data.file;
      let file = data.file;
      let date = new Date();
      const filePath = `${eventID}/${date.toISOString()}-${data.filename}`;
      // console.log(filePath);
      const fileRef = this.afstore.ref(filePath);
      const task = this.afstore.upload(filePath, file, {
        customMetadata: { eventID: eventID, id: id }
      });

      // let percentage = task.percentageChanges();

      let snapshot = task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            let downloadURL = await fileRef.getDownloadURL().toPromise();
            resolve(downloadURL);
          })
        )
        .subscribe();
    });
    // task.percentageChanges().toPromise().then((val) => {
    //   console.log(val);
    // })
  }

  async reportConfession(eventID: string, confession: any) {
    let newID = this.db.createId();
    let id = confession.id;
    return this.db
      .doc(`events/${eventID}/reports/${newID}`)
      .set({
        id: newID,
        confession: id,
        eventID: eventID,
        timestamp: new Date()
      })
      .then(() => {
        return this.db
          .doc(`events/${eventID}/confessions/${id}`)
          .update({ reportCount: confession.reportCount + 1 });
      });
  }

  async summarizeData(eventID: string) {
    let confessions = await this.db
      .collection(`events/${eventID}/confessions`)
      .get()
      .pipe(first())
      .toPromise();
    let data = {
      eventID: eventID,
      lastUpdate: new Date(),
      confessions: { total: confessions.size, accepted: 0, rejected: 0 },
      comments: { total: 0, accepted: 0, rejected: 0, commented: 0 },
      reactions: { total: 0, heart: 0, sad: 0, smile: 0, thumbs: 0, scored: 0 },
      averages: {
        comments: 0,
        reactions: 0,
        heart: 0,
        sad: 0,
        smile: 0,
        thumbs: 0,
        acceptRate: 0,
        commentRate: 0
      }
    };

    confessions.forEach(val => {
      let v = val.data();
      data.confessions.accepted += v.visible ? 1 : 0;
      data.confessions.rejected +=
        v.status && v.status.trim().toLowerCase() === "not approved" ? 1 : 0;
      if (v.visible) {
        data.reactions.total += v.score;
        data.reactions.heart += v.reaction.heart;
        data.reactions.sad += v.reaction.sad;
        data.reactions.smile += v.reaction.smile;
        data.reactions.thumbs += v.reaction.thumbs;
        data.comments.total += v.commentCount;
        data.comments.rejected += v.commentPending;
        data.comments.accepted += v.commentCount - v.commentPending;
        data.reactions.scored += v.score > 0 ? 1 : 0;
        data.comments.commented += v.commentCount > 0 ? 1 : 0;
      }
    });

    data.averages.comments = data.comments.total / data.comments.commented;
    data.averages.reactions = data.reactions.total / data.confessions.accepted;
    data.averages.heart = data.reactions.heart / data.reactions.scored;
    data.averages.sad = data.reactions.sad / data.reactions.scored;
    data.averages.smile = data.reactions.smile / data.reactions.scored;
    data.averages.thumbs = data.reactions.thumbs / data.reactions.scored;
    data.averages.commentRate = data.comments.accepted / data.comments.total;
    data.averages.acceptRate =
      data.confessions.accepted / data.confessions.total;
    // Summary stuff
    await this.db
      .doc(`summaries/${eventID}`)
      .set(Object.assign({}, data), { merge: true });
    return Promise.resolve(data);
  }
}

// RANDOM DATA
//   this.confessions = Array(100)
//   .fill(1)
//   .map(_ => {
//     return {
//       from: faker.name.findName(),
// to: faker.name.findName(),
// message: faker.hacker.phrase(),
// id: 'apple',
// reaction: {
//   heart: 12,
//   smile: 5,
//   thumbs: 2,
//   sad: 0,
// },
// score: 4,
// visible: true,

// dateCreated: new Date(faker.date.past),
// dateApproved: new Date(faker.date.future),
// comments: [], // should be in order
// commentCount: 6,
// commentPending: 2,
//     };
//   });
//   if (this.confessions.length === 100) {
//     console.log('Completed');
//     for (const i of this.confessions) {
//       const id = this.db.createId();
//       i.id = id;
//       // this.db.doc('events/summit-12/confessions/' + id).set(i);
//       // console.log("Finished");
//       // return;
//     }
//     // this.confessions.forEach((res) => {
//     //   console.log(res);
//     //   this.db.collection('events').doc('summit-12').collection('confessions').add(res);
//     //   console.log("Added");
//     //   return;
//     // });
//   }
