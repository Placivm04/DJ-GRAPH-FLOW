
import { useState, useEffect } from 'react';
import { api, type Playlist, type Song } from '../lib/api';
import { Plus, Trash2, Music, FolderOpen, Play, Search, X } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

export default function CratesView() {
    const { currentSong, setCurrentSong } = useMusic();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [playlistsLoading, setPlaylistsLoading] = useState(false);

    // New Playlist State
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

    // Selected Playlist Data
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    // Add Songs Modal State
    const [showAddSongsModal, setShowAddSongsModal] = useState(false);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [songSearch, setSongSearch] = useState('');
    const [selectedSongsToAdd, setSelectedSongsToAdd] = useState<Set<string>>(new Set());

    // Play Confirmation Modal State
    const [songToPlay, setSongToPlay] = useState<Song | null>(null);
    const [showPlayConfirmModal, setShowPlayConfirmModal] = useState(false);

    useEffect(() => {
        loadPlaylists();
    }, []);

    useEffect(() => {
        if (selectedPlaylistId) {
            loadSelectedPlaylist();
        } else {
            setSelectedPlaylist(null);
        }
    }, [selectedPlaylistId]);

    const loadPlaylists = async () => {
        setPlaylistsLoading(true);
        try {
            const data = await api.getPlaylists();
            setPlaylists(data);
        } finally {
            setPlaylistsLoading(false);
        }
    };

    const loadSelectedPlaylist = async () => {
        if (!selectedPlaylistId) return;
        try {
            const data = await api.getPlaylist(selectedPlaylistId);
            setSelectedPlaylist(data);
        } catch (error) {
            console.error("Failed to load playlist", error);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            await api.createPlaylist(newPlaylistName);
            setNewPlaylistName('');
            setShowNewPlaylistInput(false);
            loadPlaylists();
        } catch (error) {
            console.error("Failed to create playlist", error);
        }
    };

    const handleDeletePlaylist = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this crate?')) return;
        try {
            await api.deletePlaylist(id);
            if (selectedPlaylistId === id) setSelectedPlaylistId(null);
            loadPlaylists();
        } catch (error) {
            console.error("Failed to delete playlist", error);
        }
    };

    const handleOpenAddSongsModal = async () => {
        try {
            const songs = await api.getSongs();
            setAllSongs(songs);
            setSelectedSongsToAdd(new Set());
            setShowAddSongsModal(true);
        } catch (error) {
            console.error("Failed to load songs", error);
        }
    };

    const toggleSongSelection = (songId: string) => {
        const newSet = new Set(selectedSongsToAdd);
        if (newSet.has(songId)) {
            newSet.delete(songId);
        } else {
            newSet.add(songId);
        }
        setSelectedSongsToAdd(newSet);
    };

    const handleAddSongsToPlaylist = async () => {
        if (!selectedPlaylistId) return;
        try {
            for (const songId of selectedSongsToAdd) {
                await api.addSongToPlaylist(selectedPlaylistId, songId);
            }
            setShowAddSongsModal(false);
            loadSelectedPlaylist();
        } catch (error) {
            console.error("Failed to add songs", error);
        }
    };

    const handleRemoveSongFromPlaylist = async (songId: string) => {
        if (!selectedPlaylistId) return;
        if (!window.confirm('Remove song from crate?')) return;
        try {
            await api.removeSongFromPlaylist(selectedPlaylistId, songId);
            loadSelectedPlaylist();
        } catch (error) {
            console.error("Failed to remove song", error);
        }
    };

    const requestPlaySong = (song: Song) => {
        if (currentSong) {
            setSongToPlay(song);
            setShowPlayConfirmModal(true);
        } else {
            setCurrentSong(song);
        }
    };

    const confirmPlaySong = () => {
        if (songToPlay) {
            setCurrentSong(songToPlay);
            setShowPlayConfirmModal(false);
            setSongToPlay(null);
        }
    };

    const filteredAllSongs = allSongs.filter(s =>
        s.title.toLowerCase().includes(songSearch.toLowerCase()) ||
        s.artist.toLowerCase().includes(songSearch.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Sidebar: Crates List */}
            <div className="w-1/4 bg-surface/50 border border-white/5 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-primary" /> Crates
                    </h2>
                    <button
                        onClick={() => setShowNewPlaylistInput(true)}
                        className="p-1 hover:bg-white/10 rounded-full transition"
                        title="New Crate"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {showNewPlaylistInput && (
                    <div className="p-3 bg-white/5 border-b border-white/10">
                        <input
                            autoFocus
                            className="w-full bg-black/50 border border-white/10 p-2 rounded text-sm text-white mb-2"
                            placeholder="Crate Name..."
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreatePlaylist();
                                if (e.key === 'Escape') setShowNewPlaylistInput(false);
                            }}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowNewPlaylistInput(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleCreatePlaylist} className="text-xs text-primary hover:text-primary/80 font-bold">Create</button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {playlists.map(playlist => (
                        <div
                            key={playlist.id}
                            onClick={() => setSelectedPlaylistId(playlist.id)}
                            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition ${selectedPlaylistId === playlist.id
                                ? 'bg-primary/20 border border-primary/30 text-white'
                                : 'hover:bg-white/5 text-gray-300'
                                }`}
                        >
                            <span className="font-medium truncate">{playlist.name}</span>
                            <button
                                onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {playlists.length === 0 && !playlistsLoading && (
                        <div className="p-4 text-center text-gray-500 text-sm italic">
                            No crates yet. Create one!
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content: Selected Crate */}
            <div className="flex-1 bg-surface rounded-xl border border-white/5 flex flex-col overflow-hidden">
                {selectedPlaylist ? (
                    <>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    {selectedPlaylist.name}
                                    <span className="text-sm font-normal text-gray-400 bg-white/5 px-2 py-1 rounded">
                                        {selectedPlaylist.songs.length} tracks
                                    </span>
                                </h2>
                            </div>
                            <button
                                onClick={handleOpenAddSongsModal}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition font-medium"
                            >
                                <Plus className="w-5 h-5" /> Add Songs
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-surface sticky top-0 z-10">
                                    <tr className="text-gray-500 border-b border-white/10 text-sm uppercase">
                                        <th className="p-4 font-semibold w-12"></th>
                                        <th className="p-4 font-semibold">Title</th>
                                        <th className="p-4 font-semibold">Artist</th>
                                        <th className="p-4 font-semibold">BPM</th>
                                        <th className="p-4 font-semibold">Key</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPlaylist.songs.map(song => (
                                        <tr key={song.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                                            <td className="p-4">
                                                <button
                                                    onClick={() => requestPlaySong(song)}
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition"
                                                >
                                                    <Play className="w-4 h-4 ml-0.5" />
                                                </button>
                                            </td>
                                            <td className="p-4 font-medium text-white">{song.title}</td>
                                            <td className="p-4 text-gray-400">{song.artist}</td>
                                            <td className="p-4 text-gray-300 font-mono">{song.bpm}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 border border-white/5">
                                                    {song.musicalKey}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveSongFromPlaylist(song.id)}
                                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-2"
                                                    title="Remove from Crate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {selectedPlaylist.songs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-10 text-center text-gray-500">
                                                This crate is empty. Add some songs to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <FolderOpen className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Select a crate to view its contents</p>
                    </div>
                )}
            </div>

            {/* Add Songs Modal */}
            {showAddSongsModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-surface border border-white/10 p-6 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Music className="w-5 h-5 text-primary" /> Add Songs to Crate
                            </h3>
                            <button onClick={() => setShowAddSongsModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            <input
                                className="w-full bg-black/50 border border-white/10 pl-10 p-2.5 rounded-lg text-white focus:border-primary/50 transition outline-none"
                                placeholder="Search by title or artist..."
                                value={songSearch}
                                onChange={e => setSongSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto border border-white/5 rounded-lg bg-black/20 mb-4">
                            {filteredAllSongs.map(song => {
                                const isAlreadyInPlaylist = selectedPlaylist?.songs.some(s => s.id === song.id);
                                const isSelected = selectedSongsToAdd.has(song.id);

                                if (isAlreadyInPlaylist) return null;

                                return (
                                    <div
                                        key={song.id}
                                        onClick={() => toggleSongSelection(song.id)}
                                        className={`p-3 border-b border-white/5 flex items-center justify-between cursor-pointer transition ${isSelected ? 'bg-primary/20' : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium text-white">{song.title}</div>
                                            <div className="text-xs text-gray-400">{song.artist} • {song.bpm} BPM • {song.musicalKey}</div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-600'
                                            }`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                            <button
                                onClick={() => setShowAddSongsModal(false)}
                                className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSongsToPlaylist}
                                disabled={selectedSongsToAdd.size === 0}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/20"
                            >
                                Add {selectedSongsToAdd.size} Songs
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Play Confirmation Modal */}
            {showPlayConfirmModal && songToPlay && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-surface border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl text-center">
                        <h3 className="text-xl font-bold mb-2">Replace Current Track?</h3>
                        <p className="text-gray-400 mb-6">
                            <span className="text-white font-medium">{currentSong?.title}</span> is currently loaded.
                            <br />Do you want to stop it and load <span className="text-primary font-bold">{songToPlay.title}</span>?
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowPlayConfirmModal(false)}
                                className="px-5 py-2 hover:bg-white/10 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPlaySong}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition shadow-lg shadow-red-500/20"
                            >
                                Load & Play
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
