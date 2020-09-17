import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import Owner from './User';

@Entity('lost_animals')
class LostAnimal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @OneToOne(() => Owner) // 1 animal tem apenas 1 dono
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

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
  description: string;

  @Column()
  found: boolean;

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

export default LostAnimal;
