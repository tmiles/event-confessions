import { Injectable } from "@angular/core";
import { AngularFireAnalytics } from "@angular/fire/analytics";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(private analytics: AngularFireAnalytics) {}

  /**
   *
   * @param type Type of event
   * @param metadata metadata to send with
   */
  logEvent(type: string, metadata: { [k: string]: any } = null): Promise<void> {
    return this.analytics.logEvent(type, metadata);
  }
}
