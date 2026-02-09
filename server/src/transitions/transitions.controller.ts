
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { TransitionsService } from './transitions.service';
import { Transition } from './transition.entity';

@Controller('transitions')
export class TransitionsController {
    constructor(private readonly transitionsService: TransitionsService) { }

    @Post()
    create(@Body() createTransitionDto: Partial<Transition>) {
        return this.transitionsService.create(createTransitionDto);
    }

    @Get()
    findAll(@Query('from') fromSongId?: string) {
        if (fromSongId) {
            return this.transitionsService.findBySource(fromSongId);
        }
        return this.transitionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transitionsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTransitionDto: Partial<Transition>) {
        return this.transitionsService.update(id, updateTransitionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transitionsService.remove(id);
    }
}
