document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Homepage Logic ---
    const featuredEventsContainer = document.getElementById('featured-events');
    const reviewsContainer = document.getElementById('reviews-container');

    if (featuredEventsContainer) {
        loadFeaturedEvents();
    }

    if (reviewsContainer) {
        loadReviews();
        setupReviewModal();
    }
});

function loadFeaturedEvents() {
    const events = DataService.getUpcomingEvents();
    const container = document.getElementById('featured-events');

    // Take top 3 upcoming events
    const publishedEvents = events.slice(0, 3);

    if (publishedEvents.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No upcoming events at the moment. Check back soon!</p>';
        return;
    }

    container.innerHTML = publishedEvents.map(event => `
        <div class="event-card" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.3s;">
            <div style="height: 200px; background-image: url('${DataService.escapeHtml(event.imageUrl)}'); background-size: cover; background-position: center;"></div>
            <div style="padding: 20px;">
                <span style="background: var(--background-light); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; color: var(--primary-color); font-weight: bold; text-transform: uppercase;">${DataService.escapeHtml(event.category)}</span>
                <h3 style="margin-top: 10px; font-size: 1.25rem;">${DataService.escapeHtml(event.title)}</h3>
                <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 15px;">${new Date(event.date).toDateString()}</p>
                <a href="event-details.html?id=${event.id}" class="btn btn-secondary" style="width: 100%;">View Details</a>
            </div>
        </div>
    `).join('');
}

function loadReviews() {
    const reviews = DataService.getReviews();
    const container = document.getElementById('reviews-container');

    const approvedReviews = reviews.filter(r => r.status === 'approved');

    if (approvedReviews.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No reviews yet. Be the first!</p>';
        return;
    }

    container.innerHTML = approvedReviews.map(review => `
        <div class="review-card" style="background: var(--background-light); padding: 20px; border-radius: 8px;">
            <div style="color: var(--warning-color); margin-bottom: 10px;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p style="font-style: italic; margin-bottom: 15px;">"${DataService.escapeHtml(review.comment)}"</p>
            <h4 style="font-size: 1rem; color: var(--primary-dark);">- ${DataService.escapeHtml(review.name)}</h4>
        </div>
    `).join('');
}

function setupReviewModal() {
    const modal = document.getElementById('review-modal');
    const openBtn = document.getElementById('open-review-modal');
    const closeBtn = document.getElementById('close-review-modal');
    const form = document.getElementById('review-form');

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('review-name').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const comment = document.getElementById('review-comment').value;

        const newReview = {
            name,
            rating,
            comment
        };

        DataService.addReview(newReview);

        alert('Thank you! Your review has been submitted for moderation.');
        modal.style.display = 'none';
        form.reset();
    });
}
