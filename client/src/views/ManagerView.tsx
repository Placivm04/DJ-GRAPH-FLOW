
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Song, Transition } from '../lib/api';
import { Plus, X, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortConfig = {
    key: keyof Song;
    direction: 'asc' | 'desc';
} | null;

export default function ManagerView() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    // Transition Modal State
    const [showTransitionsModal, setShowTransitionsModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [newTransition, setNewTransition] = useState<{ toSongId: string; rating: number; notes: string }>({
        toSongId: '', rating: 5, notes: ''
    });

    // Simple form state
    const [newSong, setNewSong] = useState<Partial<Song>>({
        title: '', artist: '', bpm: 124, musicalKey: '8A'
    });

    const loadSongs = () => {
        api.getSongs().then(setSongs);
    };

    useEffect(() => {
        loadSongs();
    }, []);

    const handleCreate = async () => {
        if (editingId) {
            await api.updateSong(editingId, newSong);
        } else {
            await api.createSong(newSong);
        }
        setShowAddModal(false);
        setEditingId(null);
        loadSongs();
        setNewSong({ title: '', artist: '', bpm: 124, musicalKey: '8A' });
    };

    const handleEdit = (song: Song) => {
        setNewSong({
            title: song.title,
            artist: song.artist,
            bpm: song.bpm,
            musicalKey: song.musicalKey
        });
        setEditingId(song.id);
        setShowAddModal(true);
    };

    const openTransitions = async (song: Song) => {
        setSelectedSong(song);
        const data = await api.getTransitions(song.id);
        setTransitions(data);
        setShowTransitionsModal(true);
        setNewTransition({ toSongId: '', rating: 5, notes: '' });
    };

    const handleAddTransition = async () => {
        if (!selectedSong || !newTransition.toSongId) return;
        await api.createTransition({
            fromSongId: selectedSong.id,
            toSongId: newTransition.toSongId,
            rating: newTransition.rating,
            notes: newTransition.notes
        });
        const data = await api.getTransitions(selectedSong.id);
        setTransitions(data);
        setNewTransition(prev => ({ ...prev, toSongId: '', notes: '' }));
    };

    const handleDeleteTransition = async (transitionId: string) => {
        if (!window.confirm('Are you sure you want to delete this transition?')) return;

        await api.deleteTransition(transitionId);

        if (selectedSong) {
            const data = await api.getTransitions(selectedSong.id);
            setTransitions(data);
        }
    };
    const handleSort = (key: keyof Song) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSongs = [...songs].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        if (a[key] < b[key]) {
            return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getSortIcon = (key: keyof Song) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 ml-1 text-primary" />
            : <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
    };

    return (
        <div className="bg-surface rounded-xl border border-white/5 min-h-[500px] p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Library Manager</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus className="w-5 h-5" /> Add Track
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 border-b border-white/10">
                            <th
                                className="p-3 cursor-pointer hover:text-white transition group"
                                onClick={() => handleSort('title')}
                            >
                                <div className="flex items-center">
                                    Title {getSortIcon('title')}
                                </div>
                            </th>
                            <th
                                className="p-3 cursor-pointer hover:text-white transition group"
                                onClick={() => handleSort('artist')}
                            >
                                <div className="flex items-center">
                                    Artist {getSortIcon('artist')}
                                </div>
                            </th>
                            <th
                                className="p-3 cursor-pointer hover:text-white transition group"
                                onClick={() => handleSort('bpm')}
                            >
                                <div className="flex items-center">
                                    BPM {getSortIcon('bpm')}
                                </div>
                            </th>
                            <th
                                className="p-3 cursor-pointer hover:text-white transition group"
                                onClick={() => handleSort('musicalKey')}
                            >
                                <div className="flex items-center">
                                    Key {getSortIcon('musicalKey')}
                                </div>
                            </th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSongs.map(song => (
                            <tr key={song.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="p-3 font-medium">{song.title}</td>
                                <td className="p-3 text-gray-400">{song.artist}</td>
                                <td className="p-3">{song.bpm}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{song.musicalKey}</span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(song)}
                                        className="text-accent hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                    <span className="text-gray-600">|</span>
                                    <button
                                        onClick={() => openTransitions(song)}
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Transitions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {songs.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        Library is empty. Add some tracks!
                    </div>
                )}
            </div>

            {/* Simple Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-surface border border-white/10 p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Track' : 'Add New Track'}</h3>
                        <div className="space-y-3">
                            <input
                                className="w-full bg-black/50 border border-white/10 p-2 rounded text-white"
                                placeholder="Title"
                                value={newSong.title}
                                onChange={e => setNewSong({ ...newSong, title: e.target.value })}
                            />
                            <input
                                className="w-full bg-black/50 border border-white/10 p-2 rounded text-white"
                                placeholder="Artist"
                                value={newSong.artist}
                                onChange={e => setNewSong({ ...newSong, artist: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="w-1/2 bg-black/50 border border-white/10 p-2 rounded text-white"
                                    placeholder="BPM"
                                    value={newSong.bpm}
                                    onChange={e => setNewSong({ ...newSong, bpm: Number(e.target.value) })}
                                />
                                <input
                                    className="w-1/2 bg-black/50 border border-white/10 p-2 rounded text-white"
                                    placeholder="Key (e.g. 8A)"
                                    value={newSong.musicalKey}
                                    onChange={e => setNewSong({ ...newSong, musicalKey: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 hover:bg-white/10 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded"
                            >
                                Save Track
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transitions Modal */}
            {showTransitionsModal && selectedSong && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface border border-white/10 p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Transitions for: <span className="text-primary">{selectedSong.title}</span></h3>
                            <button onClick={() => setShowTransitionsModal(false)}><X className="w-5 h-5" /></button>
                        </div>

                        {/* Existing Transitions List */}
                        <div className="mb-6 space-y-2">
                            <label className="text-sm text-gray-400 uppercase font-bold">Existing Suggestions</label>
                            {transitions.length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No transitions yet.</p>
                            ) : (
                                transitions.map(t => (
                                    <div key={t.id} className="bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{t.toSong?.title}</span>
                                            <span className="text-xs text-gray-500">({t.toSong?.bpm} BPM / {t.toSong?.musicalKey})</span>
                                        </div>
                                        <div className="text-sm text-gray-400">{t.notes}</div>
                                        <button
                                            onClick={() => handleDeleteTransition(t.id)}
                                            className="ml-3 text-gray-500 hover:text-red-500 transition p-1"
                                            title="Delete Suggestion"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add New Transition Form */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="font-bold mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Suggestion</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <select
                                    className="bg-black/50 border border-white/10 p-2 rounded text-white"
                                    value={newTransition.toSongId}
                                    onChange={e => setNewTransition({ ...newTransition, toSongId: e.target.value })}
                                >
                                    <option value="">Select Target Song...</option>
                                    {songs.filter(s => s.id !== selectedSong.id).map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.title} ({s.bpm} BPM / {s.musicalKey})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className="bg-black/50 border border-white/10 p-2 rounded text-white"
                                    placeholder="Notes (optional)"
                                    value={newTransition.notes}
                                    onChange={e => setNewTransition({ ...newTransition, notes: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAddTransition}
                                disabled={!newTransition.toSongId}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Link Song
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
