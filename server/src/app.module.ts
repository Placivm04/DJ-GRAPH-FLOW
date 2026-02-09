
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { TransitionsModule } from './transitions/transitions.module';
import { Song } from './songs/song.entity';
import { Transition } from './transitions/transition.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dj-graph.db',
      entities: [Song, Transition],
      synchronize: true, // Auto-create tables (dev only)
      autoLoadEntities: true,
    }),
    SongsModule,
    TransitionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
