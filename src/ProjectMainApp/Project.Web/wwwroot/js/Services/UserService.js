const UserService = {
    baseUrl: 'https://localhost:7500/api/user',

    async getProfile() {
        const response = await $.ajax({
            url: `${this.baseUrl}/profile`,
            method: 'GET',
            headers: ServiceUtils.getHeaders()
        });
        if (response.isSuccess) return response.data;
        throw new Error(response.errorMessage || 'Failed to load profile');
    },

    async updateProfile(data) {
        const response = await $.ajax({
            url: `${this.baseUrl}/profile`,
            method: 'PUT',
            contentType: 'application/json',
            headers: ServiceUtils.getHeaders(),
            data: JSON.stringify(data)
        });
        if (response.isSuccess) return response.data;
        throw new Error(response.errorMessage || 'Failed to update profile');
    }
};

window.UserService = UserService;
