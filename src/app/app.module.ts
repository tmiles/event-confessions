import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireAnalyticsModule, CONFIG } from "@angular/fire/analytics";
import { ChartsModule } from "ng2-charts";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";

import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AppComponent } from "./app.component";
import { AdminEventComponent } from "./admin-event/admin-event.component";
import { DataService } from "./services/data.service";
import { ConfessionsComponent } from "./confessions/confessions.component";
import { ConfessionComponent } from "./confession/confession.component";
import { CommentComponent } from "./comment/comment.component";
import { CommentsComponent } from "./comments/comments.component";
import { ScrollableDirective } from "./scrollable.directive";
import { AdminConfessionComponent } from "./admin-confession/admin-confession.component";
import { InfiniteConfessionsComponent } from "./infinite-confessions/infinite-confessions.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ConfessionDialogComponent } from "./confession-dialog/confession-dialog.component";
import { ConfessionViewDialogComponent } from "./confession-view-dialog/confession-view-dialog.component";
import { CreateEventComponent } from "./create-event/create-event.component";
import { ConfessionCardComponent } from "./confession-card/confession-card.component";
import { FilterPipe } from "./filter.pipe";
import { ArraySortPipe } from "./arraysort.pipe";

import { FilePondModule, registerPlugin } from "ngx-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { HomeComponent } from "./home/home.component";

registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginFileValidateType);

import { AutosizeTextComponent } from "./autosize-text/autosize-text.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MaterialModules } from "./core/core.module";

const appRoutes: Routes = [
  {
    path: "infinite",
    component: InfiniteConfessionsComponent,
  },
  { path: "", component: HomeComponent },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin-dashboard/admin-dashboard.module").then(
        (m) => m.AdminDashboardModule
      ),
  },
  { path: ":id/admin", component: AdminEventComponent },
  { path: ":id", component: ConfessionsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminEventComponent,
    ConfessionsComponent,
    ConfessionComponent,
    CommentComponent,
    CommentsComponent,
    ScrollableDirective,
    AdminConfessionComponent,
    InfiniteConfessionsComponent,
    ConfessionDialogComponent,
    ConfessionViewDialogComponent,
    CreateEventComponent,
    ConfessionCardComponent,
    FilterPipe,
    ArraySortPipe,
    HomeComponent,
    AutosizeTextComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    RouterModule.forRoot(appRoutes),
    ScrollingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    MaterialModules,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [
        {
          name: "textarea-auto-resize",
          component: AutosizeTextComponent,
          wrappers: ["form-field"],
        },
      ],
    }),
    FormlyMaterialModule,
    FilePondModule,
    FontAwesomeModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: CONFIG,
      useValue: {
        send_page_view: true,
        allow_ad_personalization_signals: false,
        anonymize_ip: true,
        DEBUG_MODE: true,
        APP_VERSION: "6.8.0",
      },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfessionDialogComponent],
})
export class AppModule {}
