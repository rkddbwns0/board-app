import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import UsersEntity from './users.entity';

@Entity('user_token')
export default class TokenEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  token: string;

  @Column({
    type: 'timestamp',
    default: "CURRENT_TIMESTAMP + INTERVAL '7 DAY'",
  })
  expires_in: Date;

  @OneToOne(() => UsersEntity, (user) => user.token)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
