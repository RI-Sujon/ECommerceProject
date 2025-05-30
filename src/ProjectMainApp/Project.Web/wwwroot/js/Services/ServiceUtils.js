const ServiceUtils = {
    getHeaders() {
        const userInfo = Common.getUserInfo();
        return {
            'X-User-Id': userInfo.userId,
            'X-Username': userInfo.username
        };
    }
};

// Initialize the utility
window.ServiceUtils = ServiceUtils; 