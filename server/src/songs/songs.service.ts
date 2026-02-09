
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) { }

    create(createSongDto: Partial<Song>) {
        const song = this.songsRepository.create(createSongDto);
        return this.songsRepository.save(song);
    }

    findAll(search?: string) {
        if (search) {
            return this.songsRepository.find({
                where: [
                    { title: ILike(`%${search}%`) },
                    { artist: ILike(`%${search}%`) },
                ],
                order: { title: 'ASC' },
            });
        }
        return this.songsRepository.find({
            order: { title: 'ASC' },
        });
    }

    findOne(id: string) {
        return this.songsRepository.findOne({
            where: { id },
            relations: ['outgoingTransitions', 'incomingTransitions', 'outgoingTransitions.toSong', 'incomingTransitions.fromSong']
        });
    }

    async update(id: string, updateSongDto: Partial<Song>) {
        await this.songsRepository.update(id, updateSongDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.songsRepository.delete(id);
        return { deleted: true };
    }
}
