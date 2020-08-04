import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { DataService } from "../services/data.service";
import Swal from "sweetalert2";

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
  @Input() event: any;
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
        label: "URL Event ID",
        placeholder: "URL Event ID",
        required: true,
        description: "This is going to be what the unique web link will be.",
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
        description: "See all submissions and moderation.",
      },
    },
    {
      key: "adminViewPassword",
      type: "input",
      templateOptions: {
        label: "Admin View Only Password",
        placeholder: "Admin View Only Password",
        description:
          "Admin view doesn't allow for moderation. Admin view password should be different from admin password.",
      },
    },
    {
      key: "rules",
      type: "textarea-auto-resize",
      templateOptions: {
        rows: 4,
        label: "Community rules/guidelines",
        description:
          "Community rules on submissions or contact information for moderators.",
      },
    },
  ];

  constructor(private ds: DataService) {}

  ngOnInit() {
    if (this.formType === "admin") {
      // Allow updating
      if (this.event) {
        // console.log("Admin moderating");
        // pull up event details
        this.model = this.event;
        // console.log("Loading event information right now");
      } else {
        // TODO Do other stuff (nothing right now)
      }
    } else if (this.formType === "public") {
      this.fields.push({
        key: "contactName",
        type: "input",
        templateOptions: {
          required: true,
          label: "Contact Name",
          placeholder: "Contact Name",
        },
      });
      this.fields.push({
        key: "contactEmail",
        type: "input",
        templateOptions: {
          required: true,
          label: "Contact Email",
          placeholder: "Contact Email",
        },
      });
    }
  }

  // TODO ensure document doesn't already exist first
  update() {
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
          // TODO send out an email telling about status to them and me
          Swal.fire({
            title: "Event modified",
            text: `${val}`,
            icon: "success",
          });
        });
      }
    });
  }
}
