import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '../config/upload';

import Ong from './User';

@Entity('ong_animals')
class OngAnimal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ong_id: string;

  @OneToOne(() => Ong) // 1 animal tem apenas 1 ong
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  @Column()
  name: string;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column()
  size: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  adopted: boolean;

  @Column()
  description: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }
    return `${process.env.APP_API_URL}/files/${this.avatar}`;
  }
}

export default OngAnimal;
