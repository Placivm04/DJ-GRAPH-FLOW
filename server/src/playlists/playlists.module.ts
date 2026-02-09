
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './playlist.entity';
import { Song } from '../songs/song.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Playlist, Song])],
    providers: [PlaylistsService],
    controllers: [PlaylistsController],
    exports: [PlaylistsService],
})
export class PlaylistsModule { }
