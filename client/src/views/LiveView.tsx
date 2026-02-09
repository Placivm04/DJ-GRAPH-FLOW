
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Song, Transition } from '../lib/api';
import { useMusic } from '../contexts/MusicContext';
import { Search, Music } from 'lucide-react';

export default function LiveView() {
    const { currentSong, setCurrentSong, playedSongs, togglePlayed } = useMusic();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [suggestions, setSuggestions] = useState<Transition[]>([]);

    // Search logic
    useEffect(() => {
        if (query.length > 1) {
            api.getSongs(query).then(setSearchResults);
        } else {
            setSearchResults([]);
        }
    }, [query]);

    // Fetch suggestions when current song changes
    useEffect(() => {
        if (currentSong) {
            api.getTransitions(currentSong.id).then(setSuggestions);
            setQuery(''); // Clear search
            setSearchResults([]);
        } else {
            setSuggestions([]);
        }
    }, [currentSong]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* LEFT: Current Context */}
            <div className="md:col-span-1 bg-surface p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider">Now Playing</h2>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                        placeholder="Search Track..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="bg-zinc-800 rounded-lg border border-white/10 overflow-hidden max-h-60 overflow-y-auto z-10">
                        {searchResults.map(song => (
                            <div
                                key={song.id}
                                onClick={() => setCurrentSong(song)}
                                className="p-3 hover:bg-primary/20 cursor-pointer flex justify-between items-center"
                            >
                                <span>{song.title}</span>
                                <span className="text-xs text-gray-400">{song.bpm} BPM</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Active Song Card */}
                {currentSong ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center gap-2">
                        <div className="w-full aspect-square bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                            <Music className="w-24 h-24 text-white/20" />
                        </div>
                        <h1 className="text-3xl font-bold">{currentSong.title}</h1>
                        <h2 className="text-xl text-gray-400">{currentSong.artist}</h2>
                        <div className="flex gap-4 mt-6">
                            <div className="bg-black/40 px-6 py-3 rounded-lg border border-white/10">
                                <span className="block text-xs text-gray-500 uppercase">BPM</span>
                                <span className="text-2xl font-mono text-primary">{currentSong.bpm}</span>
                            </div>
                            <div className="bg-black/40 px-6 py-3 rounded-lg border border-white/10">
                                <span className="block text-xs text-gray-500 uppercase">Key</span>
                                <span className="text-2xl font-mono text-accent">{currentSong.musicalKey}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-600 italic">
                        Select a track to start
                    </div>
                )}
            </div>

            {/* CENTER: Suggestions */}
            <div className="md:col-span-2 bg-surface p-6 rounded-xl border border-white/5 overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-6">Suggestions</h2>

                <div className="space-y-3">
                    {suggestions.map(t => (
                        <div key={t.id} className="bg-black/40 p-4 rounded-lg border border-white/5 hover:border-primary/50 transition cursor-pointer group flex gap-4">
                            {/* Checkbox for Played Status */}
                            <div className="flex items-start pt-1">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-black/50"
                                    checked={t.toSong ? playedSongs.has(t.toSong.id) : false}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        if (t.toSong) togglePlayed(t.toSong.id);
                                    }}
                                />
                            </div>

                            <div className="flex-1" onClick={() => t.toSong && setCurrentSong(t.toSong)}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`font-bold text-lg group-hover:text-primary transition ${t.toSong && playedSongs.has(t.toSong.id) ? 'text-gray-500 line-through' : ''}`}>
                                            {t.toSong?.title || 'Unknown Title'}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{t.toSong?.artist}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-accent font-bold">{t.toSong?.musicalKey}</div>
                                        <div className="text-xs text-gray-500">
                                            {Number(t.toSong?.bpm && currentSong?.bpm ? t.toSong.bpm - currentSong.bpm : 0).toFixed(1)} BPM
                                        </div>
                                    </div>
                                </div>
                                {t.notes && (
                                    <div className="mt-3 text-sm text-gray-500 bg-white/5 p-2 rounded">
                                        "{t.notes}"
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {currentSong && suggestions.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">
                            No recorded transitions found.
                            <br />
                            <span className="text-sm">Go to Manager view to add some!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
