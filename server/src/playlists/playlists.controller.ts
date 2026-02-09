
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) { }

    @Post()
    create(@Body('name') name: string): Promise<Playlist> {
        return this.playlistsService.create(name);
    }

    @Get()
    findAll(): Promise<Playlist[]> {
        return this.playlistsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Playlist> {
        return this.playlistsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.playlistsService.remove(id);
    }

    @Post(':id/songs')
    addSong(
        @Param('id') id: string,
        @Body('songId') songId: string,
    ): Promise<Playlist> {
        return this.playlistsService.addSong(id, songId);
    }

    @Delete(':id/songs/:songId')
    removeSong(
        @Param('id') id: string,
        @Param('songId') songId: string,
    ): Promise<Playlist> {
        return this.playlistsService.removeSong(id, songId);
    }
}
