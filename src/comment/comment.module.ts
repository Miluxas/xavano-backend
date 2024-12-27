import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './controllers';
import {
  commentErrorMessages
} from './errors';
import { CommentService } from './services';
import { Comment } from './entities';
import { ErrorHandlerModule } from '../error-handler';
import { UserModule } from '../user';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
    ]),
    ErrorHandlerModule.register({
      ...commentErrorMessages,
    }),
    UserModule
  ],
  controllers: [
    CommentController,
  ],
  providers: [
    CommentService,
  ],
})
export class CommentModule {}
