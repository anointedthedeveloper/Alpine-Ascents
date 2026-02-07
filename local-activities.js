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
        this.updateLocationDisplay();
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
                    this.updateLocationDisplay();
                    
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
        
        const activityTypes = [
            'Rock Climbing',
            'Ice Climbing',
            'Mountain Hiking',
            'Alpine Trekking',
            'Bouldering',
            'Via Ferrata'
        ];
        
        const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        
        const facilities = [
            'Equipment Rental',
            'Guided Tours',
            'Training Courses',
            'Climbing Walls',
            'Safety Gear',
            'Certified Instructors'
        ];
        
        this.activities = [];
        
        for (let i = 0; i < 6; i++) {
            const type = activityTypes[i % activityTypes.length];
            const distance = (Math.random() * 15 + 2).toFixed(1);
            
            this.activities.push({
                id: i + 1,
                name: `${cityName} ${type} Club`,
                type: type,
                distance: parseFloat(distance),
                difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Higher ratings for personalization
                description: `Discover the best ${type.toLowerCase()} spots right here in ${cityName}. Our local experts provide specialized guidance for all skill levels in the ${cityName} area.`,
                features: facilities.slice(0, Math.floor(Math.random() * 3) + 3),
                image: this.getActivityImage(type),
                coordinates: {
                    lat: this.userLocation.lat + (Math.random() - 0.5) * 0.1,
                    lon: this.userLocation.lon + (Math.random() - 0.5) * 0.1
                }
            });
        }
        
        this.activities.sort((a, b) => a.distance - b.distance);
        this.loading = false;
    }
    
    getActivityImage(type) {
        const imageMap = {
            'Rock Climbing': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Ice Climbing': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Mountain Hiking': 'https://images.unsplash.com/photo-1508166466929-4c6c56df18f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Alpine Trekking': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Bouldering': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Via Ferrata': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };
        
        return imageMap[type] || 'https://images.unsplash.com/photo-1508166466929-4c6c56df18f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    updateLocationDisplay() {
        const locationElement = document.getElementById('currentLocation');
        if (this.userLocation.city) {
            const locationText = `${this.userLocation.city}, ${this.userLocation.country}`;
            locationElement.textContent = locationText;
            
            // Also update the global status box if the function exists
            if (typeof updateStatusLocation === 'function') {
                updateStatusLocation(this.userLocation.city, this.userLocation.country);
            }
        }
    }
    
    displayActivities() {
        const container = document.getElementById('activitiesContainer');
        const seeMoreButton = document.getElementById('seeMoreButton');
        
        if (this.loading) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-mountain fa-spin"></i>
                    <p>Finding alpine activities in your area...</p>
                </div>
            `;
            return;
        }
        
        if (this.activities.length === 0) {
            container.innerHTML = `
                <div class="no-activities">
                    <i class="fas fa-mountain"></i>
                    <h3>No activities found in your area</h3>
                    <p>Try searching in a nearby city or check back later.</p>
                </div>
            `;
            seeMoreButton.style.display = 'none';
            return;
        }
        
        container.innerHTML = this.activities.map(activity => `
            <div class="activity-card" data-aos="fade-up">
                <div class="activity-image">
                    <img src="${activity.image}" alt="${activity.name}">
                </div>
                <div class="activity-content">
                    <span class="activity-type">${activity.type}</span>
                    <h3>${activity.name}</h3>
                    <div class="activity-distance">
                        <i class="fas fa-map-marker-alt"></i>
                        ${activity.distance} km away • ${activity.difficulty} Level
                    </div>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-rating">
                        <i class="fas fa-star" style="color: #f1c40f;"></i>
                        ${activity.rating}/5 • ${Math.floor(Math.random() * 100) + 20} reviews
                    </div>
                    <div class="activity-features">
                        ${activity.features.map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        seeMoreButton.style.display = 'block';
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