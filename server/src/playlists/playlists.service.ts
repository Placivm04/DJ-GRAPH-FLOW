
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Song } from '../songs/song.entity';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist)
        private playlistsRepository: Repository<Playlist>,
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) { }

    create(name: string): Promise<Playlist> {
        const playlist = this.playlistsRepository.create({ name, songs: [] });
        return this.playlistsRepository.save(playlist);
    }

    findAll(): Promise<Playlist[]> {
        return this.playlistsRepository.find({ relations: ['songs'] });
    }

    async findOne(id: string): Promise<Playlist> {
        const playlist = await this.playlistsRepository.findOne({
            where: { id },
            relations: ['songs'],
        });
        if (!playlist) {
            throw new NotFoundException(`Playlist with ID ${id} not found`);
        }
        return playlist;
    }

    async remove(id: string): Promise<void> {
        await this.playlistsRepository.delete(id);
    }

    async addSong(playlistId: string, songId: string): Promise<Playlist> {
        const playlist = await this.findOne(playlistId);
        const song = await this.songsRepository.findOneBy({ id: songId });

        if (!song) {
            throw new NotFoundException(`Song with ID ${songId} not found`);
        }

        // Check if song is already in playlist
        if (!playlist.songs.some(s => s.id === song.id)) {
            playlist.songs.push(song);
            return this.playlistsRepository.save(playlist);
        }

        return playlist;
    }

    async removeSong(playlistId: string, songId: string): Promise<Playlist> {
        const playlist = await this.findOne(playlistId);
        playlist.songs = playlist.songs.filter(s => s.id !== songId);
        return this.playlistsRepository.save(playlist);
    }
}
