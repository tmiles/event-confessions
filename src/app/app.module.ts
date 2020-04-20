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
import { AdminComponent } from "./admin/admin.component";
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

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";

registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginFileValidateType);

import { AutosizeTextComponent } from "./autosize-text/autosize-text.component";
import { AdminDashComponent } from "./admin-dash/admin-dash.component";
import { AuthService } from "./services/auth.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

const MaterialModules = [
  MatProgressSpinnerModule,
  MatDividerModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatTabsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatExpansionModule,
];

const appRoutes: Routes = [
  {
    path: "infinite",
    component: InfiniteConfessionsComponent,
  },
  { path: "dashboard", component: AdminDashComponent },
  { path: "", component: HomeComponent },
  { path: ":id/admin", component: AdminComponent },
  { path: ":id", component: ConfessionsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
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
    AdminDashComponent,
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
  ],
  providers: [
    DataService,
    AuthService,
    {
      provide: CONFIG,
      useValue: {
        send_page_view: true,
        allow_ad_personalization_signals: false,
        anonymize_ip: true,
        DEBUG_MODE: true,
        APP_VERSION: "6.6.0",
      },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfessionDialogComponent],
})
export class AppModule {}
