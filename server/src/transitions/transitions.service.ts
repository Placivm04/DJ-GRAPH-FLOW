
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transition } from './transition.entity';
import { Song } from '../songs/song.entity';

@Injectable()
export class TransitionsService {
    constructor(
        @InjectRepository(Transition)
        private transitionsRepository: Repository<Transition>,
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) { }

    async create(createTransitionDto: Partial<Transition>) {
        // Ideally validation happens here or in DTO
        // Check if songs exist
        const { fromSongId, toSongId } = createTransitionDto;
        if (!fromSongId || !toSongId) {
            throw new Error('fromSongId and toSongId are required');
        }

        const transition = this.transitionsRepository.create(createTransitionDto);
        return this.transitionsRepository.save(transition);
    }

    findAll() {
        return this.transitionsRepository.find({
            relations: ['fromSong', 'toSong'],
            take: 100 // Limit for safety
        });
    }

    findBySource(fromSongId: string) {
        return this.transitionsRepository.find({
            where: { fromSongId },
            relations: ['toSong'],
            order: { rating: 'DESC' }
        });
    }

    findOne(id: string) {
        return this.transitionsRepository.findOne({
            where: { id },
            relations: ['fromSong', 'toSong']
        });
    }

    async update(id: string, updateTransitionDto: Partial<Transition>) {
        await this.transitionsRepository.update(id, updateTransitionDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.transitionsRepository.delete(id);
        return { deleted: true };
    }
}
