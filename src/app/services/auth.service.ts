import { Injectable } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";

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
        this.afAuth.signInAnonymously().then((val) => {
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
    return this.db
      .doc(`users/${uid}`)
      .set({ id: uid, uid: uid, confessions: {}, events: {} }, { merge: true });
  }

  /**
   * Anonymous login and local storage setting
   */
  async anonymousLogin(): Promise<any> {
    let user = await this.afAuth.signInAnonymously();
    if (user) {
      return Promise.resolve(this.setPersistent(user.user));
    }
    return Promise.reject("Unable to login");
  }

  /**
   * Sets the persistent state of the authentication
   * @param user Firebase user to use
   */
  setPersistent(user: firebase.User) {
    let userObj = { uid: user.uid, name: null, id: user.uid };
    localStorage.setItem("auth", JSON.stringify(userObj));
    return userObj;
  }
}
