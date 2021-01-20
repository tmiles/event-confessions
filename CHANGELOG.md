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
