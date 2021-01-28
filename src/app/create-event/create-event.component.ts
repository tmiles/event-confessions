import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { DataService } from "../services/data.service";
import Swal from "sweetalert2";
import { AnalyticsService } from "../services/analytics.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styles: [
    `
      mat-card {
        width: 95%;
        margin: 10px auto;
      }
    `,
  ],
})
export class CreateEventComponent implements OnInit {
  @Input() formType: string = "public";
  @Input() events: {
    [k: string]: {
      active: boolean;
      dateCreated: Date;
      id: string;
      formal_name: string;
      organization;
      string;
    };
  } = null;
  loginForm = new FormGroup({});
  loginModel: any = {};
  loginOptions: FormlyFormOptions = {};
  loginFields: FormlyFieldConfig[] = [
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

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  public adminPassword: string = "superAdminPassword";
  fields: FormlyFieldConfig[] = null;

  constructor(private ds: DataService, private ans: AnalyticsService) {}

  ngOnInit() {
    if (this.formType === "admin") {
      // Allow updating
    } else if (this.formType === "public") {
      this.fields = this.ds.createEventFields;
      // this.fields.push({
      //   key: "contactName",
      //   type: "input",
      //   templateOptions: {
      //     required: true,
      //     label: "Contact Name",
      //     placeholder: "Contact Name",
      //   },
      // });
      // this.fields.push({
      //   key: "contactEmail",
      //   type: "input",
      //   templateOptions: {
      //     required: true,
      //     label: "Contact Email",
      //     placeholder: "Contact Email",
      //     description: "To contact you",
      //   },
      // });
      // this.fields.push({
      //   key: "emailNotifications",
      //   type: "checkbox",
      //   defaultValue: false,
      //   templateOptions: {
      //     required: true,
      //     label: "Moderation Email Notifications?",
      //     description:
      //       "Do you want to get email notifications on confessions moderation?",
      //   },
      // });
    }
  }

  // TODO update this to generate id field
  async create() {
    Swal.fire({
      title: "Feature down",
      text: "Feature down right now",
      icon: "warning",
    });
    return null;
    if (!this.events) {
      this.events = this.ds.arrayToMap(
        await this.ds.getAllEvents(null).pipe(first()).toPromise()
      );
    }

    Swal.fire({
      title: "Event Creation",
      text: "Create/edit event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Create/edit event!",
    }).then((result) => {
      if (result.value) {
        this.ds.createEvent(this.model["id"], this.model).then((val) => {
          this.ans.logEvent("create_event");
          // TODO send an email about update
          Swal.fire({
            title: "Event created",
            text: `${val}`,
            icon: "success",
          });
        });
      }
    });
  }

  update() {}
}
