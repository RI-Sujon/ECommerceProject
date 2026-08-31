const ServiceUtils = {
    getHeaders() {
        // Redirect to login if JWT is expired before even making the request
        const token = Common.getToken();
        if (token && !Common.isLoggedIn()) {
            Common.clearToken();
            if (!window.location.pathname.toLowerCase().includes('/auth/')) {
                window.location.href = '/Auth/Login?reason=expired';
            }
            throw new Error('Session expired. Please log in again.');
        }
        const userInfo = Common.getUserInfo();
        const headers = {
            'X-User-Id': userInfo.userId,
            'X-Username': userInfo.username
        };
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    },

    handleAuthError(jqXHR) {
        if (jqXHR.status === 401) {
            Common.clearToken();
            window.location.href = '/Auth/Login?reason=expired';
        }
    }
};

// Global 401 handler — catches expired tokens mid-session
$(document).ajaxError(function (event, jqXHR) {
    if (jqXHR.status === 401 && !window.location.pathname.toLowerCase().includes('/auth/')) {
        Common.clearToken();
        window.location.href = '/Auth/Login?reason=expired';
    }
});

window.ServiceUtils = ServiceUtils; 