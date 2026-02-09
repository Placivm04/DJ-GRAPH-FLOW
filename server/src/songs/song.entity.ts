
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transition } from '../transitions/transition.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  bpm: number;

  @Column({ name: 'musical_key', length: 4, nullable: true })
  musicalKey: string;

  @Column({ type: 'int', nullable: true })
  energy: number;

  @Column('simple-json', { nullable: true, default: '[]' })
  tags: string[];

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Transition, (transition) => transition.fromSong)
  outgoingTransitions: Transition[];

  @OneToMany(() => Transition, (transition) => transition.toSong)
  incomingTransitions: Transition[];
}
