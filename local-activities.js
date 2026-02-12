// Local Activities Module
class LocalActivities {
    constructor() {
        this.activities = [];
        this.init();
    }
    
    init() {
        this.loadActivities();
        this.displayActivities();
    }

    loadActivities() {
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
            }
        ];

        this.activities = globalClubs.map((club, i) => ({
            id: i + 1,
            name: club.name,
            type: club.type,
            location: club.location,
            description: club.description,
            successStory: club.successStory,
            coords: club.coords
        }));
    }

    displayActivities() {
        const container = document.getElementById('activitiesContainer');
        const seeMoreButton = document.getElementById('seeMoreButton');
        
        if (!container) return;
        
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.localActivities = new LocalActivities();
});
