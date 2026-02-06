# Friends School Kamusinga - Event Management Platform

A responsive, mobile-first web platform for managing school tournaments, events, and registrations.

## Features

### Public Portal
*   **Responsive Design:** Optimized for mobile, tablet, and desktop.
*   **Event Listing:** Browse upcoming sports, academic, and cultural events.
*   **Registration:** Teams/Schools can register for events directly.
*   **Gallery:** Showcase of past event highlights.
*   **Testimonials:** Read and submit reviews.

### Admin Dashboard
*   **Overview:** View stats on events, registrations, and reviews.
*   **Event Management:** Create, edit, delete, and publish events.
*   **Registration Tracking:** View list of registered teams and contact details.
*   **Moderation:** Approve or delete user-submitted reviews.

## Tech Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript.
*   **Persistence:** LocalStorage (Simulated Database for MVP).
*   **Styling:** Custom CSS with Flexbox & Grid (No frameworks).

## How to Run
1.  Clone the repository or download the files.
2.  Open `index.html` in any modern web browser.
3.  **No server required** (runs entirely on the client-side for this MVP).

## Usage Guide

### For Visitors
*   Navigate to "Upcoming Events" to see what's happening.
*   Click "Register Now" on an event to sign up your team.
*   Go to "Reviews" on the homepage to leave feedback.

### For Admins
*   Click "Admin" in the navigation menu or footer.
*   Use the dashboard tabs to manage content.
*   **Note:** Changes (adding events, approving reviews) are saved to your browser's LocalStorage. Clearing browser cache will reset the data.

## Scalability & Future Improvements
*   **Backend:** The `DataService` layer is isolated in `js/data.js`. It can be easily swapped to use Firebase or a REST API without changing the UI code.
*   **Auth:** Implement real authentication for the Admin portal using Firebase Auth.
*   **Payments:** Integrate M-Pesa STK Push for automated payment collection.

## Design Decisions
*   **Color Palette:** Royal Blue (#0047AB) and White to reflect Friends School Kamusinga's identity.
*   **Mobile-First:** Hamburger menu and stacked grids ensure usability on small screens.
