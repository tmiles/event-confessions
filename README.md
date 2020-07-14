# Event Confessions

## Description

This is an anonymous confession system. Users can submit confessions addressed to an individual/group. Choosing to indicate who is from is optional. Provide a message would like to share and or a photo.

Submission requirements: Image has to be .png, .gif or .jpg. Image is not to exceed 10mb in size.

Notable features:

- Anonymous submissions
- Password entry to restrict to only attendees
- React (love, laugh, sad, thumbs up)
- Comments
- Image upload
- Advanced filtering: Date, Popularity (# of reacts), Comment Counts
  - Allows for features including reactions (thumbs, hearts, laugh)
  - Commenting

Admins are moderators

All comments need to be moderated to ensure safe space to share content.

- Status messages to ensure can see confessions pending moderation
- Password protection
- View images
- View only access, no edit

## Example Use

1. Visit: [https://summit-confessions.web.app/example](https://summit-confessions.web.app/example) for example event
   - Password `123`
2. See the admin at: [https://summit-confessions.web.app/example/admin](https://summit-confessions.web.app/example/admin)
   - Password `abc`

## Routes

- /home - Base route
- /:id - Event ID
- /:id/admin - Event specific administration
- /dashboard - ALl event management, analytics

## Technology

### Front end

- Angular 9
  - Filepond, Angular Material, charts, ngxformly
- HTML5, CSS3

### Backend

- Firestore
- Firebase Analytics

### Setup

1. Clone repo
2. Install dependencies: `npm install`
3. To run in development mode: `npm run start`
4. To build: `npm run build-op`

## Stackblitz

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/angular-nt15ln)
