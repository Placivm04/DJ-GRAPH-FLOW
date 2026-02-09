
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Song } from '../songs/song.entity';

@Entity('transitions')
export class Transition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Song, (song) => song.outgoingTransitions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'from_song_id' })
    fromSong: Song;

    @Column({ name: 'from_song_id' })
    fromSongId: string;

    @ManyToOne(() => Song, (song) => song.incomingTransitions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'to_song_id' })
    toSong: Song;

    @Column({ name: 'to_song_id' })
    toSongId: string;

    @Column({ type: 'int', default: 0 })
    rating: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column('float', { nullable: true })
    compatibility_score: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
