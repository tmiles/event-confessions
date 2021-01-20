import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnalyticsService } from "../services/analytics.service";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
import { FormlyModule } from "@ngx-formly/core";
import { AutosizeTextComponent } from "../autosize-text/autosize-text.component";
import { CONFIG } from "@angular/fire/analytics";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

export const MaterialModules = [
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

@NgModule({
  declarations: [],
  imports: [CommonModule],

  providers: [
    DataService,
    AuthService,
    AnalyticsService,
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
})
export class CoreModule {}
