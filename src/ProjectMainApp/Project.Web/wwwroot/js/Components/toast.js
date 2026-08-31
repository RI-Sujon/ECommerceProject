const Toast = {
    _container: null,

    _getContainer() {
        if (!this._container) {
            this._container = $('<div id="toast-container">').css({
                position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999, minWidth: '320px'
            });
            $('body').append(this._container);
        }
        return this._container;
    },

    show(message, type) {
        type = type || 'success';
        const bgMap = {
            success: 'bg-success text-white',
            error:   'bg-danger text-white',
            warning: 'bg-warning text-dark',
            info:    'bg-info text-dark'
        };
        const iconMap = {
            success: 'fa-check-circle',
            error:   'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info:    'fa-info-circle'
        };
        const closeClass = (type === 'success' || type === 'error') ? 'btn-close-white' : '';
        const bg   = bgMap[type]   || 'bg-secondary text-white';
        const icon = iconMap[type] || 'fa-bell';

        const $toast = $(`
            <div class="toast align-items-center ${bg} border-0 mb-2 show" role="alert" aria-live="assertive"
                 style="border-radius:var(--radius-md);box-shadow:var(--shadow-lg);animation:fadeIn 0.3s var(--ease-out) both">
                <div class="d-flex">
                    <div class="toast-body" style="font-weight:500;font-size:0.875rem;padding:0.85rem 1rem">
                        <i class="fas ${icon} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close ${closeClass} me-2 m-auto" aria-label="Close"></button>
                </div>
            </div>
        `);

        this._getContainer().append($toast);
        $toast.find('.btn-close').on('click', () => $toast.fadeOut(300, () => $toast.remove()));
        setTimeout(() => $toast.fadeOut(300, () => $toast.remove()), 4500);
    },

    success(message) { this.show(message, 'success'); },
    error(message)   { this.show(message, 'error');   },
    warning(message) { this.show(message, 'warning'); },
    info(message)    { this.show(message, 'info');    }
};

window.Toast = Toast;
