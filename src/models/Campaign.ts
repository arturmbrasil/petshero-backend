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

import Ong from './User';
import OngAnimal from './OngAnimal';

@Entity('campaigns')
class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ong_id: string;

  @OneToOne(() => Ong) // 1 campanha tem apenas 1 ong
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  @Column()
  animal_id: string;

  @OneToOne(() => OngAnimal) // 1 campanha tem apenas 1 animal
  @JoinColumn({ name: 'animal_id' })
  ongAnimal: OngAnimal;

  @Column()
  target_value: number;

  @Column()
  received_value: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  activated: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }
    return `${process.env.APP_API_URL}/files/${this.avatar}`;
  }
}

export default Campaign;
