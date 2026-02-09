
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { TransitionsModule } from './transitions/transitions.module';
import { Song } from './songs/song.entity';
import { Transition } from './transitions/transition.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dj-graph.db',
      entities: [Song, Transition, Playlist],
      synchronize: true, // Auto-create tables (dev only)
      autoLoadEntities: true,
    }),
    SongsModule,
    SongsModule,
    TransitionsModule,
    PlaylistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
