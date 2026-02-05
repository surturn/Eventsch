document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Navigation ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Events Page Logic ---
    const allEventsContainer = document.getElementById('all-events-container');
    if (allEventsContainer) {
        initEventsPage();
    }

    // --- Event Details Page Logic ---
    const eventContent = document.getElementById('event-content');
    if (eventContent) {
        initEventDetailsPage();
    }
});

// ------------------------------------------
// Events Listing Page
// ------------------------------------------
function initEventsPage() {
    const events = DataService.getEvents().filter(e => e.status === 'published');
    let currentFilter = 'all';

    const container = document.getElementById('all-events-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const render = () => {
        const filtered = currentFilter === 'all'
            ? events
            : events.filter(e => e.category === currentFilter);

        if (filtered.length === 0) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No events found in this category.</p>';
            return;
        }

        container.innerHTML = filtered.map(event => `
            <div class="event-card" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="height: 200px; background-image: url('${event.imageUrl}'); background-size: cover; background-position: center;"></div>
                <div style="padding: 20px;">
                    <span style="background: var(--background-light); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; color: var(--primary-color); font-weight: bold; text-transform: uppercase;">${DataService.escapeHtml(event.category)}</span>
                    <h3 style="margin-top: 10px; font-size: 1.25rem;">${DataService.escapeHtml(event.title)}</h3>
                    <p style="color: var(--text-light); font-size: 0.9rem;">📅 ${new Date(event.date).toDateString()}</p>
                    <p style="color: var(--text-color); font-size: 0.95rem; margin: 10px 0;">${DataService.escapeHtml(event.description).substring(0, 100)}...</p>
                    <a href="event-details.html?id=${event.id}" class="btn btn-secondary" style="width: 100%;">View Details</a>
                </div>
            </div>
        `).join('');
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    render();
}

// ------------------------------------------
// Event Details Page
// ------------------------------------------
function initEventDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const event = DataService.getEventById(id);
    const container = document.getElementById('event-content');

    if (!event) {
        container.innerHTML = '<p class="text-center" style="padding: 40px;">Event not found.</p>';
        return;
    }

    // Render Event Details
    container.innerHTML = `
        <div style="height: 400px; background-image: url('${event.imageUrl}'); background-size: cover; background-position: center;"></div>
        <div style="padding: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
                <div>
                    <span style="background: var(--background-light); padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; color: var(--primary-color); font-weight: bold; text-transform: uppercase;">${DataService.escapeHtml(event.category)}</span>
                    <h1 style="margin-top: 15px; font-size: 2.5rem; color: var(--primary-dark);">${DataService.escapeHtml(event.title)}</h1>
                    <p style="color: var(--text-light); font-size: 1.1rem; margin-top: 5px;">📅 ${new Date(event.date).toDateString()}</p>
                </div>
                <button id="open-reg-modal" class="btn btn-primary" style="font-size: 1.1rem; padding: 12px 30px;">Register Now</button>
            </div>

            <div style="margin-top: 40px; line-height: 1.8; font-size: 1.1rem;">
                <h3>About This Event</h3>
                <p>${DataService.escapeHtml(event.description)}</p>

                <h3 style="margin-top: 30px;">Rules & Eligibility</h3>
                <ul style="list-style: disc; padding-left: 20px;">
                    <li>Participants must be bonafide students.</li>
                    <li>Teams must report 30 minutes before kick-off.</li>
                    <li>School ID cards are mandatory.</li>
                    <li>Fair play rules apply strictly.</li>
                </ul>
            </div>
        </div>
    `;

    setupRegistrationModal(event);
}

function setupRegistrationModal(event) {
    const modal = document.getElementById('reg-modal');
    const openBtn = document.getElementById('open-reg-modal');
    const closeBtn = document.getElementById('close-reg-modal');
    const form = document.getElementById('reg-form');

    // Pre-fill hidden fields
    document.getElementById('reg-event-id').value = event.id;
    document.getElementById('reg-event-name').value = event.title;

    if(openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const registration = {
            eventId: document.getElementById('reg-event-id').value,
            eventName: document.getElementById('reg-event-name').value,
            schoolName: document.getElementById('school-name').value,
            contactPerson: document.getElementById('contact-person').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value,
            notes: document.getElementById('team-notes').value
        };

        DataService.addRegistration(registration);

        // Show M-Pesa Instructions
        modal.style.display = 'none'; // Close form modal

        // Simple alert for MVP, or we could replace the modal content
        alert(`
            Registration Successful!

            Payment Instructions:
            1. Go to M-Pesa Menu
            2. Lipa na M-Pesa -> Paybill
            3. Business No: 123456
            4. Account No: ${registration.schoolName.substring(0, 10).toUpperCase()}
            5. Amount: KES 2,000

            A confirmation email has been sent to ${registration.email}.
        `);

        form.reset();
    });
}
