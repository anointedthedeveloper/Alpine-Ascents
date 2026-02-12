# Alpine Ascents Developer Guide

This guide provides technical documentation for developers who wish to modify or extend the **Alpine Ascents** portal.

## 1. Project Architecture
The project is a static web application built with a modular approach:
- **Separation of Concerns**: HTML handles structure, CSS handles styling, and JavaScript handles dynamic behavior and data fetching.
- **External Dependencies**: Uses CDNs for Bootstrap (UI), AOS (Animations), and Font Awesome (Icons).

## 2. Directory Structure
```text
/
├── css/
│   ├── base.css        # Root variables, colors, typography
│   ├── components.css  # Cards, buttons, navigation
│   ├── layout.css      # Structural layout (flexbox/grid)
│   └── sections.css    # Section-specific styles
├── js/
│   ├── main.js         # Core initialization and menu logic
│   ├── slideshow.js    # Hero slider logic
│   ├── status.js       # Status box and date/time tracking
├── local-activities.js # Activity data logic and display logic
├── index.html          # Main entry point
└── *.jpg, *.png, etc.  # Assets
```

## 3. Customizing Content
### Updating Clubs/Activities
Open `local-activities.js` and modify the `globalClubs` array inside the `loadActivities()` method. Each club object requires:
- `name`, `type`, `location`, `description`, and `successStory`.

### Modifying the Status Box
The status box values can be updated in `index.html` (for static values) or `js/status.js` (for dynamic values like time).

### Adding New Records
New mountaineering records can be added directly in the `records` section of `index.html`. Follow the existing Bootstrap column pattern for consistency.

## 4. Ticker Geolocation Logic
The status ticker uses a fallback strategy:
1. `navigator.geolocation`: Browser-native high accuracy location.
2. `ip-api.com` (Pro): High-speed IP-based location fallback.
3. `ipapi.co`: Secondary IP-based fallback.
4. Static Fallback: Defaults to New York if all services fail.

## 5. Animation Controls
Animations are handled by **AOS**. To change an animation, update the `data-aos` attribute on the relevant HTML element (e.g., `fade-up`, `zoom-in`, `flip-left`).

## 6. Deployment
Since the project is built with vanilla web technologies, it can be hosted on any static hosting service like **GitHub Pages**, **Vercel**, or **Netlify** by simply uploading the root directory.
