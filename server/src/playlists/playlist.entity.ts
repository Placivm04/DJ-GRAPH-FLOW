
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Song } from '../songs/song.entity';

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Song)
    @JoinTable()
    songs: Song[];
}
