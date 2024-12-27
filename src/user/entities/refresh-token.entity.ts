import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn({})
  id: number = 0;

  @Column()
  uid: string = "";

  @Column()
  userId: number = 0;

  @Column()
  token: string = "";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expiresAt: Date = new Date();
}
