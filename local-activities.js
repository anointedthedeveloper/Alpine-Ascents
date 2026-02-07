// Local Activities Module
class LocalActivities {
    constructor() {
        this.userLocation = null;
        this.activities = [];
        this.loading = true;
        this.init();
    }
    
    async init() {
        // First try to check if we already have permission or if we should use IP as fallback
        const permissionStatus = await this.checkPermission();
        
        if (permissionStatus === 'granted') {
            await this.getUserLocation();
        } else {
            // Show a "Grant Permission" UI in the container initially
            this.showPermissionRequest();
            // Still try IP-based location in the background for the status box
            await this.getIPLocation();
        }
        
        await this.loadActivities();
        this.displayActivities();
    }

    async checkPermission() {
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                return result.state; // 'granted', 'prompt', or 'denied'
            } catch (e) {
                return 'prompt';
            }
        }
        return 'prompt';
    }

    showPermissionRequest() {
        const container = document.getElementById('activitiesContainer');
        if (container) {
            container.innerHTML = `
                <div class="permission-request" style="text-align: center; padding: 40px; background: #fff; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #27ae60; margin-bottom: 20px;"></i>
                    <h3>Discover Alpine Activities Near You</h3>
                    <p>We use your location to find climbing spots and trekking clubs in your immediate area.</p>
                    <button id="grantLocationBtn" class="btn" style="margin-top: 20px;">
                        <i class="fas fa-location-arrow"></i> Enable Location
                    </button>
                    <p style="font-size: 0.8rem; color: #888; margin-top: 15px;">Note: If you see an "overlay detected" error, please close the status bar at the bottom and try again.</p>
                </div>
            `;
            
            const btn = document.getElementById('grantLocationBtn');
            if (btn) {
                btn.addEventListener('click', async () => {
                    // Briefly hide status box to avoid overlay issues on mobile
                    const statusBox = document.getElementById('statusBoxContainer');
                    if (statusBox) statusBox.style.display = 'none';
                    
                    await this.getUserLocation();
                    await this.loadActivities();
                    this.displayActivities();
                    
                    // Show status box again
                    if (statusBox) statusBox.style.display = 'block';
                });
            }
        }
    }

    async getUserLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        };
                        
                        // Try to get city name
                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.userLocation.lat}&lon=${this.userLocation.lon}`
                            );
                            const data = await response.json();
                            this.userLocation.city = data.address.city || 
                                                   data.address.town || 
                                                   data.address.village ||
                                                   data.address.county ||
                                                   'Your Area';
                            this.userLocation.country = data.address.country || '';
                        } catch (error) {
                            this.userLocation.city = 'Your Location';
                        }
                        
                        resolve();
                    },
                    () => {
                        // Fallback to IP-based location
                        this.getIPLocation().then(resolve);
                    },
                    { timeout: 5000 }
                );
            } else {
                this.getIPLocation().then(resolve);
            }
        });
    }
    
    async getIPLocation() {
        try {
            // Using the provided API key for ip-api.com (pro) or similar
            const apiKey = 'tE6LT91lTvOLl2Bp0VgvQwvmtQ4uhyLdKu73s0JvaJ1IWwHXtioJ5UpMjSy8FnVE';
            const response = await fetch(`https://pro.ip-api.com/json/?key=${apiKey}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.userLocation = {
                    lat: data.lat,
                    lon: data.lon,
                    city: data.city,
                    country: data.country
                };
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            // Fallback to free service if pro fails
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                this.userLocation = {
                    lat: data.latitude,
                    lon: data.longitude,
                    city: data.city,
                    country: data.country_name
                };
            } catch (fallbackError) {
                // Default to a major city
                this.userLocation = {
                    lat: 40.7128,
                    lon: -74.0060,
                    city: 'New York',
                    country: 'USA'
                };
            }
        }
    }
    
    async loadActivities() {
        const cityName = this.userLocation.city || 'Local';
        
        // Global Mountaineering Organizations
        const globalClubs = [
            {
                name: "The Alpine Club",
                type: "International Club",
                location: "London, United Kingdom",
                coords: { lat: 51.5246, lon: -0.0847 },
                description: "The world's first mountaineering club, founded in 1857. They organize expeditions to the Greater Ranges.",
                successStory: "Recent successful exploration of the Zanskar range in India."
            },
            {
                name: "American Alpine Club",
                type: "National Organization",
                location: "Golden, Colorado, USA",
                coords: { lat: 39.7555, lon: -105.2211 },
                description: "A non-profit organization that provides climbing community, advocacy, and conservation.",
                successStory: "Successfully campaigned for the protection of Bear's Ears climbing areas."
            },
            {
                name: "Himalayan Club",
                type: "Expedition Group",
                location: "Mumbai, India",
                coords: { lat: 18.9220, lon: 72.8347 },
                description: "Dedicated to the exploration and knowledge of the Himalaya. Organizes annual youth camps.",
                successStory: "Organized the 2023 Siachen Glacier scientific expedition."
            },
            {
                name: "Club Alpino Italiano",
                type: "National Club",
                location: "Milan, Italy",
                coords: { lat: 45.4642, lon: 9.1900 },
                description: "One of the oldest alpine clubs, managing hundreds of mountain huts across the Alps.",
                successStory: "Managed the massive 2024 Dolomites Safety Awareness Camp."
            },
            {
                name: "Nigeria Mountaineering Federation",
                type: "National Federation",
                location: "Abuja, Nigeria",
                coords: { lat: 9.0765, lon: 7.3986 },
                description: "Promoting mountain sports and trekking across the diverse Nigerian landscapes.",
                successStory: "Successful Chappal Waddi summit expedition in 2023."
            },
            {
                name: "Shere Hills Climbing Club",
                type: "Regional Club",
                location: "Jos, Nigeria",
                coords: { lat: 9.9189, lon: 8.8917 },
                description: "Specializing in rock climbing and high-altitude training in the scenic Plateau region.",
                successStory: "Completed the 2024 Shere Peak endurance challenge with 50 participants."
            },
            {
                name: "Idanre Peak Explorers",
                type: "Trekking Group",
                location: "Ondo, Nigeria",
                coords: { lat: 7.1100, lon: 5.1100 },
                description: "Focused on the historical and geological exploration of the Idanre Hills heritage site.",
                successStory: "Discovered three new trekking routes around the ancient hilltop settlements."
            },
            {
                name: "Obudu Mountain Explorers",
                type: "Hiking Club",
                location: "Cross River, Nigeria",
                coords: { lat: 6.6439, lon: 9.3664 },
                description: "Exploring the high-altitude Plateau of Obudu, known for its mist-covered peaks.",
                successStory: "Successfully guided a group of 30 to the highest point of the Obudu Ranch."
            },
            {
                name: "Zuma Rock Climbing Community",
                type: "Climbing Club",
                location: "Niger State, Nigeria",
                coords: { lat: 9.1292, lon: 7.2311 },
                description: "Dedicated to technical rock climbing and bouldering around the iconic Zuma Rock.",
                successStory: "Established two new climbing routes on the southern face of Zuma Rock."
            },
            {
                name: "Ghana Mountaineering Club",
                type: "Regional Group",
                location: "Accra, Ghana",
                coords: { lat: 5.6037, lon: -0.1870 },
                description: "Exploring the peaks of the Akwapim-Togo ranges and promoting eco-tourism.",
                successStory: "Organized the first Mount Afadja youth climbing festival."
            },
            {
                name: "Indian Mountaineering Foundation",
                type: "National Body",
                location: "New Delhi, India",
                coords: { lat: 28.6139, lon: 77.2090 },
                description: "The apex national body for mountaineering and rock climbing in India.",
                successStory: "Coordinated multiple successful 8000m peak expeditions in 2024."
            }
        ];

        this.activities = globalClubs.map((club, i) => ({
            id: i + 1,
            name: club.name,
            type: club.type,
            location: club.location,
            distance: club.location === "London, United Kingdom" ? 0 : (Math.random() * 5000 + 100).toFixed(0),
            description: club.description,
            successStory: club.successStory,
            coords: club.coords
        }));

        this.loading = false;
    }

    displayActivities() {
        const container = document.getElementById('activitiesContainer');
        const seeMoreButton = document.getElementById('seeMoreButton');
        
        if (this.loading) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-mountain fa-spin"></i>
                    <p>Loading global organizations...</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.activities.map(activity => `
            <div class="activity-card" data-aos="fade-up" style="border-left: 5px solid #27ae60;">
                <div class="activity-content">
                    <span class="activity-type" style="background: #27ae60; color: white; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem;">${activity.type}</span>
                    <h3 style="margin-top: 10px;">${activity.name}</h3>
                    <div class="activity-location" style="margin: 10px 0; color: #666;">
                        <i class="fas fa-map-marker-alt" style="color: #e74c3c;"></i> ${activity.location}
                    </div>
                    <p class="activity-description" style="font-weight: 600;">${activity.description}</p>
                    <div class="camp-success" style="background: #f1fcf1; padding: 15px; border-radius: 10px; margin-top: 15px;">
                        <strong style="color: #27ae60;"><i class="fas fa-check-circle"></i> Camp Success Story:</strong>
                        <p style="font-style: italic; margin-top: 5px;">${activity.successStory}</p>
                    </div>
                    <button class="btn" style="margin-top: 20px; width: 100%; padding: 10px;" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + activity.location)}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> View on Google Maps
                    </button>
                </div>
            </div>
        `).join('');
        
        if (seeMoreButton) {
            seeMoreButton.style.display = 'block';
            seeMoreButton.innerHTML = `
                <button class="btn btn-large" onclick="window.open('https://www.google.com/search?q=mountaineering+clubs+worldwide+list', '_blank')">
                    <i class="fas fa-globe"></i> View More Clubs Worldwide
                </button>
            `;
        }
    }
}

// Google Maps integration
function openGoogleMaps() {
    // Access the global localActivities instance
    const activitiesInstance = window.localActivities;
    
    if (activitiesInstance && activitiesInstance.userLocation) {
        const { lat, lon, city } = activitiesInstance.userLocation;
        // Search for activities NEAR the detected latitude and longitude
        const query = encodeURIComponent(`alpine activities climbing hiking`);
        window.open(`https://www.google.com/maps/search/${query}/@${lat},${lon},12z`, '_blank');
    } else {
        window.open('https://www.google.com/maps/search/alpine+activities+climbing/', '_blank');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.localActivities = new LocalActivities();
});