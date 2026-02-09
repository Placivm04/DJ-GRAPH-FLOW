
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) { }

    @Post()
    create(@Body() createSongDto: Partial<Song>) {
        return this.songsService.create(createSongDto);
    }

    @Get()
    findAll(@Query('search') search?: string) {
        return this.songsService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.songsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSongDto: Partial<Song>) {
        return this.songsService.update(id, updateSongDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.songsService.remove(id);
    }
}
