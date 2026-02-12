# Project Defense: Alpine Ascents Website

## 1. Project Overview
**Alpine Ascents** is a professional mountaineering and adventure tourism website designed to showcase expeditions, provide real-time environment data, and engage users with local alpine activities. The project focuses on a "Safety First" and "Expert Guidance" philosophy, translated into a modern, responsive user interface.

## 2. Technical Stack
- **Frontend**: HTML5, CSS3 (Custom variables, Flexbox, Grid), JavaScript (ES6+).
- **Libraries**: 
  - **Bootstrap 5**: For responsive layout components.
  - **FontAwesome 6**: For scalable vector icons.
  - **AOS (Animate On Scroll)**: For engaging entrance animations.
  - **BigDataCloud API**: For CORS-compliant reverse geocoding (Ticker only).
  - **Nominatim (OpenStreetMap)**: Primary geocoding source (Ticker only).
  - **ipapi.co**: Fallback for IP-based location detection (Ticker only).

## 3. Key Features & Implementation
### A. Dynamic Scrolling Ticker
- **Implementation**: Uses CSS keyframe animations for a continuous loop.
- **Logic**: Updates every second via `setInterval` in `js/status.js`.
- **Data**: Displays live Date, Time (with seconds), and User Location.

### B. Geolocation & Reverse Geocoding
- **Permissions**: Uses the HTML5 Geolocation API to request user consent.
- **Fallback**: If permission is denied or coordinates cannot be fetched, it gracefully falls back to IP-based location using `ipapi.co`.
- **Optimization**: Switched to BigDataCloud API to resolve CORS issues common with Nominatim in client-side environments.

### C. Visitor Counter
- **Storage**: Uses `localStorage` to persist total visits and `sessionStorage` to track active sessions, ensuring the counter only increments on new visits/reloads, not every page action.
- **Placement**: Strategically placed in the header for high visibility.

### D. Alpine Activities Explorer
- **Curated List**: Showcases 9 major mountaineering organizations and clubs globally.
- **Accessibility**: Provides immediate access to activity information without requiring location permissions.

## 4. Predicted Questions & Answers

**Q: Why did you move the script to an external JS file?**
*A: For better separation of concerns, improved maintainability, and browser caching benefits. It keeps the HTML clean and focused on structure.*

**Q: How do you handle cases where a user denies location access?**
*A: For the status ticker, the system detects the denial via the error callback in `getCurrentPosition` and automatically triggers an IP-based location lookup as a fallback. If that also fails, it displays "Location unavailable". The Alpine Activities section remains fully functional as it uses a curated dataset available to all users.*

**Q: How is the visitor count protected from artificial inflation?**
*A: We use a session-based flag (`sessionStorage`). The count only increments if the session flag is missing, preventing multiple increments during a single browsing session on the same tab.*

**Q: Why did you use BigDataCloud instead of Google Maps for geocoding?**
*A: BigDataCloud provides a robust, CORS-compliant API for client-side locality detection without the heavy overhead or billing complexities of the Google Maps Platform, making it ideal for this project's scope.*

**Q: Is the website mobile-responsive?**
*A: Yes, we used a mobile-first approach with Bootstrap's grid system and custom media queries to ensure the ticker, header, and content sections adapt seamlessly to all screen sizes.*

## 5. Conclusion
Alpine Ascents demonstrates a successful integration of real-time APIs with a polished UI/UX, providing a functional and informative experience for mountaineering enthusiasts while maintaining high performance and reliability.
