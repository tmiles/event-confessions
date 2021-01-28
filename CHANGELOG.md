# 7.0.0 (01.27.21)

## Events

1. Ability to favorite events
2. Integrating bottom mobile menu to create, filter, search
3. Create FAB to create confessions (popup now)
4. Additional fields for description and community rules
5. New event fields

## Event Admin

1. Edit passwords and other event details
2. Checklist of actions to take
3. New summary
4. New design to integrate data exports and charts
5. New database help articles
6. New event create menu with stepper, new fields
7. Simplifying the event admin portion

## Overall

1. New navigation
2. New home page setup
3. New url structure for events
4. New setup for feed back
5. New color schemes
6. More mobile design
7. New stepper component for forms
8. New data pipes

## Breaking changes

1. Links need to have new system
2. Can't create events through the current fields

## Upcoming

1. User feed
2. Favoriting events
3. More admin analytics
4. Leave feedback module
5. Google page analytics
6. Intro JS tutorial for first login
7. Authentication tokens or expiring passwords

# 6.7.0 (04.20.20)

## Admin Dashboard

## General

1. Compodoc generation
2. PWA Integration

# 6.6.0 (04.20.20)

## Admin Dashboard

1. Left sidebar responsive bottom navbar
2. Right sidebar for summaries
3. Implementation of left vertical tabs
   Layout for new features and functionality of event home page

## General

1. Shifting emphasis to mobile redesign similat to twitter
2. Shift to fontawesome instead of material icons
3. Version number in data service for sharing
4. Analytics service to log reactions, new confessions
5. Migrated to storing events via aggregator
6. Additional helper CSS styles
7. Loading animation for home page
8. Early progress for email service
9. Early anonymous logins for security rules moving forward

## Future

1. The additional todos found
2. Jest test integration
3. Jest test coverage
4. Documentation coverage
5. Cypress E2E testing integration

## New events

1. Ability to better customize email notifications

# 6.5.0 (03.31.20)

## Functionality

1. Improved flow for new cards
2. New dashboard for admins
3. Can submit for events on the main page

## Behind the hood

1. Packages made current, angular 9, material 9
2. Removed local storage system

## Future

1. Dashboard view for admins like the current all admin page
2. Moderate the events via the admin portal (popup)
3. Export confessions

# 6.0.0 (01.09.20)

## Functionality

Ported to stackblitz

## Features

1. Event confessions now don't re-require passwords after 2 days if same device.
2. Changed to a card grid structure
3. Changed the bottom card actions (likes, comments etc)
4. Changes some of the top usability filter/customization tools
5. Reduced the font overall throughout the page

# 3.1.0 (04.08.19)

## Admin

1. Fixes bug that caused memory leak (excessive function calls)

# 3.0.0 (04.08.19)

## Admin

1. Fixes no paginator issue
2. Refactors data password check item

## Confessions

1. Stores comment counts better
2. Can sort by basic fields (date/popularity/comments) + ascending/descending

## MISC

1. New helper functions for data conforming
2. New array sorter function (modular)
