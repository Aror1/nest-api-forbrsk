// refresh-token.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({schema: "schema", name: "tokens"})
export class RefreshToken {
  @PrimaryGeneratedColumn()
  token_id?: string;

  @Column({ unique: true })
  token_hash: string;

  @Column({nullable: true})
  user_id: number;

  @Column({ type: 'date' })
  expires_at: Date;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;
}
