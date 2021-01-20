import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { MaterialModules } from "../core/core.module";
import { ChartsModule } from "ng2-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AutosizeTextComponent } from "../autosize-text/autosize-text.component";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";
import { AdminDashEventComponent } from "./admin-dash-event/admin-dash-event.component";
import { AdminEventSummaryComponent } from "./admin-event-summary/admin-event-summary.component";
import { CreateEventComponent } from "../create-event/create-event.component";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent,
  },
  {
    path: "create",
    component: CreateEventComponent,
  },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminDashEventComponent,
    AdminEventSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    FontAwesomeModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        {
          name: "textarea-auto-resize",
          component: AutosizeTextComponent,
          wrappers: ["form-field"],
        },
      ],
    }),

    FormlyMaterialModule,
    MaterialModules,
    RouterModule.forChild(routes),
    ChartsModule,
  ],
  bootstrap: [AdminDashboardComponent],
  exports: [RouterModule],
})
export class AdminDashboardModule {}
