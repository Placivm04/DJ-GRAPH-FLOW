
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransitionsService } from './transitions.service';
import { TransitionsController } from './transitions.controller';
import { Transition } from './transition.entity';
import { SongsModule } from '../songs/songs.module';
import { Song } from '../songs/song.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transition, Song]),
        SongsModule
    ],
    controllers: [TransitionsController],
    providers: [TransitionsService],
    exports: [TransitionsService],
})
export class TransitionsModule { }
