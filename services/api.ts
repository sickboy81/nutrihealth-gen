// services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/nutrihealth-backend';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    user?: any;
    message?: string;
}

export const api = {
    async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            return { success: false, error: 'Network error' };
        }
    },

    async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<ApiResponse<T>> {
        try {
            const query = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/${endpoint}?${query}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            return { success: false, error: 'Network error' };
        }
    }
};
