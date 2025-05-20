import api from './api';

const TeamService = {
    // Get all teams
    getAllTeams: async () => {
        try {
            const response = await api.get('/teams/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get a specific team by ID
    getTeam: async (teamId) => {
        try {
            const response = await api.get(`/teams/${teamId}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a new team
    createTeam: async (teamData) => {
        try {
            // Create FormData object for file upload
            const formData = new FormData();

            // Append text fields
            formData.append('name', teamData.name);
            formData.append('description', teamData.description);

            // Append member codes as a JSON array
            formData.append('members_code_input', JSON.stringify(teamData.memberCodes));

            // Append banner file if it exists
            if (teamData.banner) {
                formData.append('banner', teamData.banner);
            }

            const response = await api.post('/teams/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update team information
    updateTeam: async (teamId, teamData) => {
        try {
            const formData = new FormData();

            if (teamData.name) formData.append('name', teamData.name);
            if (teamData.description) formData.append('description', teamData.description);
            if (teamData.banner) formData.append('banner', teamData.banner);

            const response = await api.patch(`/teams/${teamId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a team
    deleteTeam: async (teamId) => {
        try {
            await api.delete(`/teams/${teamId}/`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Search teams by name or captain
    searchTeams: async (query) => {
        try {
            const response = await api.get(`/teams/?search=${query}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default TeamService; 