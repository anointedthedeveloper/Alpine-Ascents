// ===== VISITOR COUNT =====
function updateVisitorCount() {
    let visits = localStorage.getItem('alpine_ascents_visits');
    
    if (!visits) {
        visits = 1;
    } else {
        if (!sessionStorage.getItem('alpine_ascents_session_active')) {
            visits = parseInt(visits) + 1;
            sessionStorage.setItem('alpine_ascents_session_active', 'true');
        } else {
            visits = parseInt(visits);
        }
    }
    
    localStorage.setItem('alpine_ascents_visits', visits);
    
    const headerElement = document.getElementById('headerTotalVisits');
    if (headerElement) {
        headerElement.textContent = visits.toLocaleString();
    }
}

// ===== DATE + TIME =====
function updateDateTime() {
    const now = new Date();

    // Ticker Date
    const tickerDateElements = document.querySelectorAll('.tickerDate');
    const dateString = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    tickerDateElements.forEach(el => el.textContent = dateString);

    // Ticker Time
    const tickerTimeElements = document.querySelectorAll('.tickerTime');
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    tickerTimeElements.forEach(el => el.textContent = timeString);

    // Footer Year
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = now.getFullYear();
    }
}

// ===== GEOLOCATION =====
function initGeolocation() {
    const tickerLocationElements = document.querySelectorAll('.tickerLocation');

    const updateTickerLocation = (text) => {
        tickerLocationElements.forEach(el => el.textContent = text);
    };

    async function fallbackToIP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.city && data.country_name) {
                updateTickerLocation(`${data.city}, ${data.country_name}`);
            } else {
                updateTickerLocation('Location unavailable');
            }
        } catch {
            updateTickerLocation('Location unavailable');
        }
    }

    if (!navigator.geolocation) {
        fallbackToIP();
        return;
    }

    updateTickerLocation('Requesting location...');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                // Using BigDataCloud's client-side reverse geocoding (No CORS issues)
                const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
                );
                const data = await response.json();

                const city = data.city || data.locality || data.principalSubdivision;
                const country = data.countryName;

                if (city && country) {
                    updateTickerLocation(`${city}, ${country}`);
                } else {
                    updateTickerLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
                }
            } catch {
                fallbackToIP();
            }
        },
        () => {
            fallbackToIP();
        },
        {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 600000
        }
    );
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateVisitorCount();
    updateDateTime();
    initGeolocation();
    setInterval(updateDateTime, 1000);

    // Manual location retry on click
    document.addEventListener('click', function (e) {
        if (
            e.target.classList.contains('tickerLocation') ||
            e.target.closest('.ticker-item')
        ) {
            initGeolocation();
        }
    });
});
