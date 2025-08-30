import { Card } from "scryfall-api";

// Service API centralisé pour remplacer les appels directs à la DB
const API_BASE_URL = 'http://localhost:4000/api';

export type DeckList = { 
    qty: number; 
    card: any; // Card from scryfall-api
}[];

export type Deck = {
    id?: string;
    user_id: string;
    name: string;
    color_identity: string[];
    commanders: Card[]; // Card[] from scryfall-api
    mainboard: DeckList;
    sideboard: DeckList;
    archetypes?: Archetype[];
    created_at?: string;
    likes: number;
}

export type AppUser = {
    id: string;
    username: string;
    email: string;
    pfp?: string;
    header_bg?: string;
    description?: string;
    followers: string[];
    following: string[];
    created_at: string;
    is_test: boolean;
}

export type Archetype = {
    id: string;
    name: string;
    description?: string;
}

// Utility function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return response.json();
}

// ============================================
// USERS API
// ============================================
export const usersApi = {
    async getById(userId: string): Promise<AppUser> {
        return apiCall(`/users/${userId}`, {
            method: "GET",
        });
    },

    async getAll(): Promise<AppUser[]> {
        return apiCall('/users/all', {
            method: "GET",
        });
    },

    async create(userData: { username: string; email: string; password: string }): Promise<AppUser> {
        return apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    async update(userId: string, updates: Partial<AppUser>): Promise<AppUser> {
        return apiCall(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    },

    async delete(userId: string): Promise<void> {
        return apiCall(`/users/${userId}`, {
            method: 'DELETE',
        });
    },

    async follow(userId: string, targetId: string): Promise<{ success: boolean }> {
        return apiCall('/users/follow', {
            method: 'POST',
            body: JSON.stringify({ userId, targetId }),
        });
    },

    async unfollow(userId: string): Promise<{ success: boolean }> {
        return apiCall('/users/unfollow', {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
    },
};

// ============================================
// DECKS API
// ============================================
export const decksApi = {
    async getById(deckId: string): Promise<Deck> {
        return apiCall(`/decks/${deckId}`, {
            method: "GET"
        });
    },

    async getAllFromUser(userId: string): Promise<Deck[]> {
        return apiCall(`/decks/user/${userId}`, {
            method: "GET",
        });
    },

    async create(userId: string, deck: Omit<Deck, 'user_id'>): Promise<Deck> {
        return apiCall(`/decks/user/${userId}`, {
            method: 'POST',
            body: JSON.stringify({ deck: deck }),
        });
    },

    async update(deckId: string, updates: { mainboard: DeckList; sideboard: DeckList }): Promise<Deck> {
        return apiCall(`/decks/${deckId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    },

    async delete(deckId: string): Promise<void> {
        return apiCall(`/decks/${deckId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// CARDS API
// ============================================
export const cardsApi = {
    async getRandom(): Promise<any> {
        return apiCall('/cards/random', {
            method: "GET",
        });
    },

    async getRandomCommander(): Promise<any> {
        return apiCall('/cards/random/edh', {
            method: "GET",
        });
    },

    async search(query: string): Promise<any> {
        return apiCall(`/cards/search/${encodeURIComponent(query)}`, {
            method: 'POST',
        });
    },

    async getById(cardId: string): Promise<any> {
        return apiCall(`/cards/${cardId}`, {
            method: "GET",
        });
    },

    async getPrints(cardId: string): Promise<any> {
        return apiCall(`/cards/${cardId}/prints`, {
            method: "GET",
        });
    },
};

// ============================================
// ARCHETYPES API
// ============================================
export const archetypesApi = {
    async getAll(): Promise<Archetype[]> {
        return apiCall('/tags/all', {
            method: "GET",
        });
    },

    async getForDeck(deckId: string): Promise<Archetype[]> {
        return apiCall(`/tags/decks/${deckId}`, {
            method: "GET",
        });
    },

    async addToDeck(deckId: string, archetypes: { id: string }[]): Promise<{ message: string }> {
        return apiCall(`/tags/deck/${deckId}`, {
            method: 'POST',
            body: JSON.stringify({ archetypes }),
        });
    },
};

// ============================================
// STORAGE API
// ============================================
export const storageApi = {
    async uploadAvatar(userId: string, file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/storage/avatar/${userId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return response.json();
    },

    async updateAvatarUrl(userId: string, url: string): Promise<void> {
        return apiCall(`/storage/avatar/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ url }),
        });
    },

    async uploadHeader(userId: string, file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/storage/header/${userId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return response.json();
    },

    async updateHeaderUrl(userId: string, url: string): Promise<void> {
        return apiCall(`/storage/header/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ url }),
        });
    },
};
