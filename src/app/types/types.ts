export interface Confession {
  from: string;
  to: string;
  message: string;
  id: string;
  reaction: {
    heart: number;
    smile: number;
    thumbs: number;
    sad: number;
  };
  score: number;
  visible: boolean;
  // Todo later
  imageVisible?: boolean;
  imageUrl?: string;
  dateCreated: Date;
  dateApproved: Date;
  comments?: Comment[]; // should be in order
  commentCount?: number;
  commentPending?: number;
  status: string; // not approved, pending comments etc
}

export interface Comment {
  message: string;
  dateApproved: Date;
  dateCreated: Date;
  visible: boolean; // approved
  id: number;
}

export interface QueryConfig {
  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

export interface Organization {
  events: string[]; // Event ID's
  name: string;
  createDate: Date;
  organizationID: string; // the URL
  disabled: boolean;
  logoImg: string; // logo image for top icon
  tabTitle: string;
}

export interface Event {
  id: string;
  title: string;
  password: string;
  dateCreate: Date;
  dateOpen: Date;
  dateClosed: Date;
  confessions?: any[];
}
