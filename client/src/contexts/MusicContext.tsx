import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Song } from '../lib/api';

interface MusicContextType {
    currentSong: Song | null;
    playedSongs: Set<string>;
    setCurrentSong: (song: Song | null) => void;
    togglePlayed: (songId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSongState] = useState<Song | null>(null);
    const [playedSongs, setPlayedSongs] = useState<Set<string>>(new Set());

    const setCurrentSong = (song: Song | null) => {
        setCurrentSongState(song);
        if (song) {
            setPlayedSongs(prev => new Set(prev).add(song.id));
        }
    };

    const togglePlayed = (songId: string) => {
        setPlayedSongs(prev => {
            const next = new Set(prev);
            if (next.has(songId)) {
                next.delete(songId);
            } else {
                next.add(songId);
            }
            return next;
        });
    };

    return (
        <MusicContext.Provider value={{ currentSong, playedSongs, setCurrentSong, togglePlayed }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}
