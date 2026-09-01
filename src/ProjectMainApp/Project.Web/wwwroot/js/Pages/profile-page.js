class ProfilePage {
    constructor() {
        this.container = $('#profile-container');
    }

    async initialize() {
        if (!Common.isLoggedIn()) { window.location.href = '/Auth/Login'; return; }

        this.container.html('<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
        try {
            const profile = await UserService.getProfile();
            this.render(profile);
        } catch (e) {
            this.container.html(`<div class="alert alert-danger">${e.message || 'Failed to load profile.'}</div>`);
        }
    }

    render(profile) {
        const initial = (profile.fullName || profile.email).charAt(0).toUpperCase();
        const roleColor = profile.role === 'Admin' ? 'danger' : 'primary';

        this.container.html(`
            <div class="row justify-content-center fade-in">
                <div class="col-md-6">
                    <div class="card" style="box-shadow:var(--shadow-md)">
                        <div class="card-header fw-semibold">
                            <i class="fas fa-user-circle me-2" style="color:var(--accent)"></i>Profile Settings
                        </div>
                        <div class="card-body" style="padding:2rem">
                            <div class="text-center mb-4">
                                <div class="profile-avatar mb-3">
                                    ${initial}
                                </div>
                                <h5 style="font-family:var(--font-display);font-weight:700;color:var(--primary);margin-bottom:0.25rem">${profile.fullName}</h5>
                                <p class="mb-1 text-muted small">${profile.email}</p>
                                <span class="badge bg-${roleColor}">${profile.role}</span>
                            </div>
                            ${profile.role !== 'Admin' ? `
                            <div class="row g-3 mb-4">
                                <div class="col-6">
                                    <div class="stat-card">
                                        <span class="stat-value" style="color:var(--primary)">${profile.orderCount ?? 0}</span>
                                        <span class="stat-label">Orders Placed</span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-card">
                                        <span class="stat-value" style="color:var(--success)">৳${(profile.totalSpent ?? 0).toFixed(2)}</span>
                                        <span class="stat-label">Total Spent</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-grid mb-4">
                                <a href="/Order" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-box me-2"></i>View My Orders
                                </a>
                            </div>` : ''}
                            <hr style="border-color:var(--neutral-200)">
                            <form id="profileForm" novalidate>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Full Name</label>
                                    <input type="text" id="profileFullName" class="form-control"
                                           value="${profile.fullName}" required maxlength="200">
                                </div>
                                <hr style="border-color:var(--neutral-200)">
                                <p class="text-muted small mb-2">
                                    <i class="fas fa-lock me-1" style="color:var(--accent)"></i>Leave password fields blank to keep current password.
                                </p>
                                <div class="mb-3">
                                    <label class="form-label">Current Password</label>
                                    <input type="password" id="profileCurrentPwd" class="form-control"
                                           placeholder="Required to change password" autocomplete="current-password">
                                </div>
                                <div class="mb-4">
                                    <label class="form-label">New Password</label>
                                    <input type="password" id="profileNewPwd" class="form-control"
                                           placeholder="Min 8 chars, uppercase, digit, symbol" autocomplete="new-password">
                                </div>
                                <button type="submit" class="btn btn-primary w-100" id="saveProfileBtn" style="height:44px;font-weight:600">
                                    <i class="fas fa-save me-2"></i>Save Changes
                                </button>
                            </form>
                        </div>
                        <div class="card-footer text-muted small">
                            <i class="fas fa-calendar-alt me-1" style="color:var(--accent)"></i>
                            Member since: ${new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        `);

        $('#profileForm').on('submit', async function (e) {
            e.preventDefault();
            const $btn = $('#saveProfileBtn');
            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...');
            try {
                await UserService.updateProfile({
                    fullName:        $('#profileFullName').val().trim(),
                    currentPassword: $('#profileCurrentPwd').val() || null,
                    newPassword:     $('#profileNewPwd').val() || null
                });
                Toast.success('Profile updated successfully!');
                $('#profileCurrentPwd, #profileNewPwd').val('');
            } catch (err) {
                Toast.error(err.responseJSON?.errorMessage || err.message || 'Failed to update profile');
            } finally {
                $btn.prop('disabled', false).html('<i class="fas fa-save me-2"></i>Save Changes');
            }
        });
    }
}

$(document).ready(() => {
    const page = new ProfilePage();
    page.initialize();
});
