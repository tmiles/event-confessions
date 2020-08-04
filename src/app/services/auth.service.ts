import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class AuthService {
  user$: Observable<any> = null;
  userID: string = null;
  constructor(public afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userID = user.uid;
          return this.db.doc(`users/${this.userID}`).valueChanges();
        }
        this.userID = null;
        this.afAuth.auth.signInAnonymously().then((val) => {
          this.createUser(val.user.uid);
        });
        return of(null);
      })
    );
    this.user$.subscribe();
  }

  getUserID() {
    return this.userID;
  }

  createUser(uid: string): Promise<void> {
    // console.log("Created new user");
    return this.db
      .doc(`users/${uid}`)
      .set({ id: uid, uid: uid, confessions: {}, events: {} }, { merge: true });
  }
}
