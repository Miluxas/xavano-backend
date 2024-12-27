
import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';
export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
}

@Entity()
export class Comment extends BaseModel {
  @Column({nullable:true})
  parentId?: number;

  @Column()
  userId: number=0;

  @Column({ type: 'json' })
  user?: {fullName:string};

  @Column({type:'text'})
  content: string='';

  @Column()
  status: CommentStatus=CommentStatus.PENDING;

}
