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
  fields: FormlyFieldConfig[] = [
    {
      key: "formal_name",
      type: "input",
      templateOptions: {
        label: "Event Formal Name",
        placeholder: "Event Name",
        required: true,
      },
    },
    {
      key: "organization",
      type: "input",
      templateOptions: {
        label: "Organization Name",
        placeholder: "Organization Name",
        required: true,
      },
    },
    {
      key: "id",
      type: "input",
      templateOptions: {
        label: "URL",
        placeholder: "Requested URL",
        description: "This is what's going to appear in the address bar",
        required: true,
      },
    },
    {
      key: "password",
      type: "input",
      templateOptions: {
        label: "Attendee Password",
        placeholder: "Attendee Password",
        required: true,
      },
    },
    {
      key: "adminPassword",
      type: "input",
      templateOptions: {
        label: "Admin Password",
        placeholder: "Admin Password",
        required: true,
      },
    },
    {
      key: "adminViewPassword",
      type: "input",
      templateOptions: {
        label: "Admin View Only Password",
        placeholder: "Admin View Only Password",
      },
    },
  ];

  constructor(private ds: DataService, private ans: AnalyticsService) {}

  ngOnInit() {
    if (this.formType === "admin") {
      // Allow updating
    } else if (this.formType === "public") {
      this.fields.push({
        key: "contactName",
        type: "input",
        templateOptions: {
          required: true,
          label: "Contact Name",
          placeholder: "Contact Name",
          description: "To contact you",
        },
      });
      this.fields.push({
        key: "contactEmail",
        type: "input",
        templateOptions: {
          required: true,
          label: "Contact Email",
          placeholder: "Contact Email",
          description: "To contact you",
        },
      });
      this.fields.push({
        key: "emailNotifications",
        type: "checkbox",
        defaultValue: false,
        templateOptions: {
          required: true,
          label: "Moderation Email Notifications?",
          description:
            "Do you want to get email notifications on confessions moderation?",
        },
      });
    }
  }

  // TODO ensure document doesn't already exist first
  async create() {
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
