/**
 * Data Service for Friends School Kamusinga Events Platform
 * Handles mock persistence using localStorage
 */

const DB_KEYS = {
    EVENTS: 'fsk_events',
    REGISTRATIONS: 'fsk_registrations',
    REVIEWS: 'fsk_reviews'
};

// Seed Data
const initialEvents = [
    {
        id: '1',
        title: 'FSK Annual Rugby Opens',
        date: '2023-11-15',
        category: 'Sports',
        description: 'The premier rugby tournament in Western Kenya. Schools from all over the region compete for the championship.',
        imageUrl: 'https://images.unsplash.com/photo-1543132220-444127548c03?auto=format&fit=crop&q=80',
        status: 'published'
    },
    {
        id: '2',
        title: 'Regional Science Congress',
        date: '2023-12-05',
        category: 'Academics',
        description: 'Innovators and young scientists present their projects in physics, chemistry, and biology.',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
        status: 'published'
    },
    {
        id: '3',
        title: 'Cultural Music Festival',
        date: '2023-12-12',
        category: 'Cultural',
        description: 'A celebration of music, dance, and poetry from different cultures.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80',
        status: 'published'
    },
    {
        id: '4',
        title: 'The Annual Allan Bradley Tournament',
        date: '2026-02-07',
        categoryId: 'Sports',
        description: 'Friends School Kamusinga Presents The Annual Allan Bradley Tournament. Games Featured: Basketball, Hockey, Soccer, Rugby, Lawn Tennis, Swimming, Volleyball, Badminton, Chess, Table Tennis. Entry Fee: 2,500 per team. Contact GM: Mr. Kasembeli (0711 357 698) - Use Common Sense.',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80',
        status: 'published'
    }
];

const initialReviews = [
    {
        id: '1',
        name: 'John Doe (Alumni)',
        comment: 'The organization of the Rugby Opens was world class. Proud of my school!',
        rating: 5,
        status: 'approved'
    },
    {
        id: '2',
        name: 'Sarah Smith',
        comment: 'Great experience at the science congress. Learned a lot.',
        rating: 4,
        status: 'approved'
    }
];

const DataService = {
    // Initialization
    init() {
        let events = JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || 'null');

        if (!events) {
            localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(initialEvents));
        } else {
            // Check for new seed data and append if missing (Migration strategy)
            let changed = false;
            initialEvents.forEach(seedEvent => {
                if (!events.find(e => e.id === seedEvent.id)) {
                    events.push(seedEvent);
                    changed = true;
                }
            });
            if (changed) {
                localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
            }
        }

        if (!localStorage.getItem(DB_KEYS.REVIEWS)) {
            localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(initialReviews));
        }
        if (!localStorage.getItem(DB_KEYS.REGISTRATIONS)) {
            localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify([]));
        }
    },

    // --- EVENTS ---
    getEvents() {
        return JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]');
    },

    getUpcomingEvents() {
        const events = this.getEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        return events
            .filter(e => {
                const eventDate = new Date(e.date);
                return eventDate >= today && e.status === 'published';
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending (nearest first)
    },

    getPastEvents() {
        const events = this.getEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events
            .filter(e => {
                const eventDate = new Date(e.date);
                return eventDate < today && e.status === 'published';
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending (most recent past first)
    },

    getEventById(id) {
        const events = this.getEvents();
        return events.find(e => e.id === id);
    },

    saveEvent(event) {
        const events = this.getEvents();
        if (event.id) {
            // Update
            const index = events.findIndex(e => e.id === event.id);
            if (index !== -1) events[index] = event;
        } else {
            // Create
            event.id = Date.now().toString();
            events.push(event);
        }
        localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
        return event;
    },

    deleteEvent(id) {
        let events = this.getEvents();
        events = events.filter(e => e.id !== id);
        localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
    },

    // --- REGISTRATIONS ---
    getRegistrations() {
        return JSON.parse(localStorage.getItem(DB_KEYS.REGISTRATIONS) || '[]');
    },

    addRegistration(registration) {
        const regs = this.getRegistrations();
        registration.id = Date.now().toString();
        registration.timestamp = new Date().toISOString();
        regs.push(registration);
        localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify(regs));
        return registration;
    },

    // --- REVIEWS ---
    getReviews() {
        return JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]');
    },

    addReview(review) {
        const reviews = this.getReviews();
        review.id = Date.now().toString();
        review.status = 'pending'; // Default status
        reviews.push(review);
        localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));
        return review;
    },

    updateReviewStatus(id, status) {
        const reviews = this.getReviews();
        const index = reviews.findIndex(r => r.id === id);
        if (index !== -1) {
            reviews[index].status = status;
            localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));
        }
    },

    deleteReview(id) {
        let reviews = this.getReviews();
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));
    },

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

// Initialize on load
DataService.init();
