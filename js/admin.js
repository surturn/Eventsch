document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDashboard();

    // Initial Loads
    loadEventsTable();
    loadRegistrationsTable();
    loadReviewsList();

    // Modal Setup
    setupEventModal();
});

function initTabs() {
    const links = document.querySelectorAll('.admin-menu a[data-tab]');
    const contents = document.querySelectorAll('.tab-content');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.dataset.tab;

            // Toggle Links
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Toggle Content
            contents.forEach(c => c.style.display = 'none');
            document.getElementById(`tab-${tabName}`).style.display = 'block';

            // Refresh data when switching tabs
            if (tabName === 'dashboard') loadDashboard();
            if (tabName === 'events') loadEventsTable();
            if (tabName === 'registrations') loadRegistrationsTable();
            if (tabName === 'reviews') loadReviewsList();
        });
    });
}

function loadDashboard() {
    const events = DataService.getEvents();
    const regs = DataService.getRegistrations();
    const reviews = DataService.getReviews();

    document.getElementById('stat-events').textContent = events.length;
    document.getElementById('stat-registrations').textContent = regs.length;
    document.getElementById('stat-reviews').textContent = reviews.filter(r => r.status === 'pending').length;
}

// --- EVENTS MANAGEMENT ---
function loadEventsTable() {
    const events = DataService.getEvents();
    const tbody = document.querySelector('#events-table tbody');

    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No events found.</td></tr>';
        return;
    }

    tbody.innerHTML = events.map(e => `
        <tr>
            <td>${DataService.escapeHtml(e.title)}</td>
            <td>${DataService.escapeHtml(e.date)}</td>
            <td>${DataService.escapeHtml(e.category)}</td>
            <td><span class="badge badge-${e.status}">${e.status}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editEvent('${e.id}')" style="padding: 4px 8px; font-size: 0.8rem;">Edit</button>
                <button class="btn" onclick="deleteEvent('${e.id}')" style="padding: 4px 8px; font-size: 0.8rem; color: var(--danger-color); border: 1px solid var(--danger-color);">Delete</button>
            </td>
        </tr>
    `).join('');
}

window.deleteEvent = function(id) {
    if(confirm('Are you sure you want to delete this event?')) {
        DataService.deleteEvent(id);
        loadEventsTable();
        loadDashboard();
    }
};

window.editEvent = function(id) {
    const event = DataService.getEventById(id);
    if (!event) return;

    document.getElementById('event-id').value = event.id;
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-category').value = event.category;
    document.getElementById('event-image').value = event.imageUrl;
    document.getElementById('event-desc').value = event.description;
    document.getElementById('event-status').value = event.status;

    document.getElementById('modal-title').textContent = 'Edit Event';
    document.getElementById('admin-event-modal').style.display = 'flex';
};

function setupEventModal() {
    const modal = document.getElementById('admin-event-modal');
    const openBtn = document.getElementById('add-event-btn');
    const closeBtn = document.getElementById('close-admin-event-modal');
    const form = document.getElementById('admin-event-form');

    openBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('event-id').value = ''; // Clear ID for new event
        document.getElementById('modal-title').textContent = 'Add New Event';
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const event = {
            id: document.getElementById('event-id').value || null, // null triggers creation
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            category: document.getElementById('event-category').value,
            imageUrl: document.getElementById('event-image').value,
            description: document.getElementById('event-desc').value,
            status: document.getElementById('event-status').value
        };

        DataService.saveEvent(event);
        modal.style.display = 'none';
        loadEventsTable();
        loadDashboard();
    });
}

// --- REGISTRATIONS MANAGEMENT ---
function loadRegistrationsTable() {
    const regs = DataService.getRegistrations();
    const tbody = document.querySelector('#regs-table tbody');

    if (regs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No registrations yet.</td></tr>';
        return;
    }

    // Sort by newest
    regs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    tbody.innerHTML = regs.map(r => `
        <tr>
            <td>
                <strong>${DataService.escapeHtml(r.schoolName)}</strong><br>
                <small>${DataService.escapeHtml(r.notes || '')}</small>
            </td>
            <td>
                ${DataService.escapeHtml(r.contactPerson)}<br>
                <small>${DataService.escapeHtml(r.email)} | ${DataService.escapeHtml(r.phone)}</small>
            </td>
            <td>${DataService.escapeHtml(r.eventName)}</td>
            <td>${new Date(r.timestamp).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

window.exportRegistrations = function() {
    const regs = DataService.getRegistrations();
    if (regs.length === 0) {
        alert('No registrations to export.');
        return;
    }

    const headers = ['ID', 'Event Name', 'School Name', 'Contact Person', 'Phone', 'Email', 'Notes', 'Timestamp'];
    const rows = regs.map(r => [
        r.id,
        `"${(r.eventName || '').replace(/"/g, '""')}"`,
        `"${(r.schoolName || '').replace(/"/g, '""')}"`,
        `"${(r.contactPerson || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        r.timestamp
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'registrations.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// --- REVIEWS MANAGEMENT ---
function loadReviewsList() {
    const reviews = DataService.getReviews();
    const container = document.getElementById('reviews-list');

    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews submitted.</p>';
        return;
    }

    container.innerHTML = reviews.map(r => `
        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow-sm); margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="color: var(--warning-color); font-size: 0.9rem;">${'★'.repeat(r.rating)} <span style="color: #ccc;">${'★'.repeat(5-r.rating)}</span></div>
                <p style="margin: 5px 0;">"${DataService.escapeHtml(r.comment)}"</p>
                <small style="color: var(--text-light);">- ${DataService.escapeHtml(r.name)}</small>
                <span class="badge badge-${r.status}" style="margin-left: 10px;">${r.status}</span>
            </div>
            <div style="min-width: 150px; text-align: right;">
                ${r.status === 'pending' ? `<button onclick="approveReview('${r.id}')" class="btn btn-primary" style="padding: 4px 8px; font-size: 0.8rem; background-color: var(--success-color);">Approve</button>` : ''}
                <button onclick="deleteReview('${r.id}')" class="btn" style="padding: 4px 8px; font-size: 0.8rem; color: var(--danger-color); border: 1px solid var(--danger-color);">Delete</button>
            </div>
        </div>
    `).join('');
}

window.approveReview = function(id) {
    DataService.updateReviewStatus(id, 'approved');
    loadReviewsList();
    loadDashboard();
};

window.deleteReview = function(id) {
    if(confirm('Delete this review?')) {
        DataService.deleteReview(id);
        loadReviewsList();
        loadDashboard();
    }
};
