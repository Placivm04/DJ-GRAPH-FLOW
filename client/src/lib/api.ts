
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Song {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    musicalKey: string;
    energy: number;
    tags: string[];
}

export interface Transition {
    id: string;
    fromSongId: string;
    toSongId: string;
    rating: number; // 1-5
    notes?: string;
    toSong?: Song;
}

export const api = {
    getSongs: async (search?: string) => {
        const params = search ? { search } : {};
        const res = await axios.get<Song[]>(`${API_URL}/songs`, { params });
        return res.data;
    },

    createSong: async (data: Partial<Song>) => {
        const res = await axios.post<Song>(`${API_URL}/songs`, data);
        return res.data;
    },

    updateSong: async (id: string, data: Partial<Song>) => {
        const res = await axios.put<Song>(`${API_URL}/songs/${id}`, data);
        return res.data;
    },

    getTransitions: async (fromSongId: string) => {
        const res = await axios.get<Transition[]>(`${API_URL}/transitions`, {
            params: { from: fromSongId }
        });
        return res.data;
    },

    createTransition: async (data: Partial<Transition>) => {
        const res = await axios.post<Transition>(`${API_URL}/transitions`, data);
        return res.data;
    },

    deleteTransition: async (id: string) => {
        const res = await axios.delete(`${API_URL}/transitions/${id}`);
        return res.data;
    }
};
