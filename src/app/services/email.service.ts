import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { AngularFirestore } from "@angular/fire/firestore";
import { DataService } from "./data.service";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { EmailTemplate } from "../types/types";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private TEMPLATE_URL = "mailTemplates/"; // base url
  private MAIL_URL = "mail";
  public emailTemplates$: Observable<EmailTemplate[]>; // stores a copy of them for use
  public emails: EmailTemplate[];
  constructor(
    private afs: AngularFirestore,
    private ds: DataService,
    private as: AuthService
  ) {
    this.initTemplates();
  }

  /**
   * Initializes all email templates,
   * pull from database if no local copy
   */
  initTemplates() {
    this.emailTemplates$ = this.getEmailTemplates(null);
    const sub = this.emailTemplates$.subscribe((res) => {
      this.emails = res;
    });
  }

  /**
   * Gets all email templates (by active status)
   * @param active active status
   */
  getEmailTemplates(active: boolean): Observable<EmailTemplate[]> {
    if (active === null) {
      if (!this.emailTemplates$) {
        this.emailTemplates$ = <Observable<EmailTemplate[]>>(
          this.afs.collection(this.TEMPLATE_URL).valueChanges()
        );
      }
      return this.emailTemplates$;
    }
    return <Observable<EmailTemplate[]>>(
      this.afs
        .collection(this.TEMPLATE_URL, (ref) =>
          ref.where("active", "==", active).orderBy("key")
        )
        .valueChanges()
    );
  }

  /**
   * Gets all email templates associated
   * @param active is it active or not
   * @param category what's the category of template (i.e. alumni, signup, registration )
   */
  getEmailTemplatesCategory(active: boolean, category: string) {
    category = category.toLowerCase();
    if (active === null) {
      return <Observable<EmailTemplate[]>>(
        this.afs
          .collection(this.TEMPLATE_URL, (ref) =>
            ref.where("category", "==", category).orderBy("key")
          )
          .valueChanges()
      );
    }
    return <Observable<EmailTemplate[]>>this.afs
      .collection(this.TEMPLATE_URL, (ref) =>
        ref.where("category", "==", category).orderBy("key")
      )
      .valueChanges()
      .pipe(
        map((templates) =>
          templates.filter(
            (rr: EmailTemplate) => rr.category.toLowerCase() === category
          )
        )
      );
  }

  async sendEmailTemplate(
    email: string,
    templateID: string,
    emailData: any = null
  ) {
    let data = {
      source: "sendEmailTemplate",
      id: `${new Date().toISOString()}-${this.afs.createId()}`,
      to: `${email.trim().toLowerCase()}`,
      template: {
        name: templateID,
        data: emailData,
      },
    };
    await this.afs.doc(`emailSends/${data.id}`).set(Object.assign({}, data));
    return Promise.resolve(`Sent email to: ${email}`);
  }

  async sendTicketTemplates(
    eid: string,
    tid: string,
    templateID: string,
    emailData: any = null
  ): Promise<any> {
    // get list of all tid holders, then write each to collection
    let ticketHolders = await this.afs
      .collection(`events/${eid}/tickets/${tid}/successful`)
      .valueChanges()
      .pipe(first())
      .toPromise();
    if (!ticketHolders) {
      return Promise.reject(["Not able to get ticket holders"]);
    }
    if (ticketHolders.length === 0) {
      return Promise.reject(["No ticket holders"]);
    }
    let emailHolders: any = {};
    ticketHolders.forEach((val) => {
      if (emailHolders[val["metadata"]["uid"]]) {
        emailHolders[val["metadata"]["uid"]].count++;
      } else {
        emailHolders[val["metadata"]["uid"]] = {
          email: val["metadata"]["email"],
          count: 1,
        };
      }
    });
    let emailSends = 0;
    for await (let uid of Object.keys(emailHolders)) {
      if (emailHolders[uid].count > 1) {
        console.log(
          `${uid}: Duplicate ticket successful holds. Please deal with.`
        );
      }
      if (!emailHolders[uid] || !emailHolders[uid]["email"]) {
        console.log(`Unable to send email, skipped: ${uid}`);
      } else {
        let data = {
          id: `${new Date().toISOString()}-${uid}`,
          to: `${emailHolders[uid]["email"].trim().toLowerCase()}`,
          template: {
            name: templateID,
            data: emailData,
          },
        };
        // await this.afs.doc(`emailSends/${data.id}`).set(Object.assign({}, data));
        emailSends++;
      }
    }
    return Promise.resolve(
      `Sent ${emailSends} emails for ticket: ${tid} for event ${eid}`
    );
  }

  /**
   * Gets an email template
   * @param eid email id
   */
  getEventEmailTemplate(
    eid: string,
    emailID: string
  ): Observable<EmailTemplate> {
    return <Observable<EmailTemplate>>(
      this.afs.doc(`events/${eid}/emails/${emailID}`).valueChanges()
    );
  }

  /**
   * Gets an email template
   * @param eid email id
   */
  getTestEmailTemplate(emailID: string): Observable<EmailTemplate> {
    return <Observable<EmailTemplate>>(
      this.afs.doc(`testEmails/${emailID}`).valueChanges()
    );
  }

  /**
   * Create an email template
   * @param et email template
   */
  createEmailTemplate(et: EmailTemplate, eventID: string): Promise<void> {
    et.id = !et.id ? this.afs.createId() : et.id;
    return this.afs
      .doc(`events/${eventID}/emails/${et.id}`)
      .set(this.ds.conformObject(et));
  }

  createBasicEmailTemplate(en: string, es: string, et: string): Promise<void> {
    let id = en.replace(" ", "~");
    let data = {
      id: id,
      date: new Date(),
      name: en,
      html: et,
      subject: es,
    };
    return this.afs.doc(`emailTemplates/${id}`).set(Object.assign({}, data));
  }

  /**
   * Lets you modify an email template
   * @todo protect against unauthroized reads
   * @param id email template id
   * @param et email template
   * @return promise upon writing to database
   */
  modifyEmailTemplate(id: string, et: EmailTemplate): Promise<void> {
    // et.id = (!et.id) ? this.afs.createId() : et.id; // shouldn't happen
    return this.afs
      .doc(`${this.TEMPLATE_URL}/${et.id}`)
      .update(this.ds.conformObject(et));
  }

  /* Sending emails */
  /**
   * @todo implement
   * @param eid email id
   * @param email email id
   * @param originUID who is sneding email to whom
   */
  sendEmailTest(eid: string, email: string, originUID: string) {
    this.getTestEmailTemplate(eid).subscribe((res) => {
      if (!res) {
        return null;
      }
      const formRequest = {
        name: "TEST",
        email,
        subject: res.subject,
        html: res.html,
        sender: this.as.getUserID(),
      };
      return this.afs
        .collection(this.MAIL_URL)
        .add(formRequest)
        .then(() => console.log("Sent email!"));
    });
  }

  /**
   * Sends an email
   * @todo complete
   * @param eid email template id
   * @param originUID origin user id
   * @param email email receipient
   */
  sendEventEmail(
    eventID: string,
    emailID: string,
    email: string,
    originUID: string,
    data: any
  ): Promise<void> {
    // get email template information

    return new Promise((resolve, reject) => {
      this.getEventEmailTemplate(eventID, emailID).subscribe((res) => {
        if (!res) {
          reject(new Error("No email template found!"));
        }
        const emailData: any = res;
        emailData.emailID = res.id;
        emailData.id = this.afs.createId();
        emailData.email = email;
        /* Process HTML Template -> @todo put on server later */

        /** HTML PARSER */
        const split = emailData.html.split("@@");
        if (split.length > 1) {
          let convertedHTML = split[0];
          for (let i = 1; i < split.length; i++) {
            if (i % 2 === 1) {
              // odd
              convertedHTML += data[split[i]]; // i.e firstName
            } else {
              convertedHTML += split[i];
            }
          }
          emailData.html = convertedHTML;
        }
        this.afs
          .doc(`/events/${eventID}/emails/${emailID}/sends/${emailData.id}`)
          .set(Object.assign({}, emailData))
          .then(() => {
            console.log("Sent email!");
            resolve();
          });
      });
    });
  }

  async sendBasicEmail(
    to: string,
    subject: string,
    email: string,
    cc?: string[],
    bcc?: string[]
  ): Promise<void> {
    let id = new Date().toISOString() + "" + this.afs.createId();
    return this.afs.doc(`${this.MAIL_URL}/${id}`).set({
      id: id,
      to: to,
      message: {
        subject: subject,
        html: email,
      },
      cc: cc || null,
      bcc: bcc || null,
    });
  }
}
