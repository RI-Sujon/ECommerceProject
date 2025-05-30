const ServiceUtils = {
    getHeaders() {
        const userInfo = SessionService.getUserInfo();
        return {
            'X-User-Id': userInfo.userId,
            'X-Username': userInfo.username
        };
    }
};

// Initialize the utility
window.ServiceUtils = ServiceUtils; 