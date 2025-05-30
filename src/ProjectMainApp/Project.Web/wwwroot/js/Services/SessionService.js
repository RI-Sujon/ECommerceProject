const SessionService = {
    userId: 1012,
    username: "sujon",

    getUserInfo() {
        return {
            userId: this.userId,
            username: this.username
        };
    }
};

// Initialize the service
window.SessionService = SessionService; 