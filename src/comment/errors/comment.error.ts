import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/interfaces';

export enum CommentError {
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export const commentErrorMessages: IMessageList<CommentError> = {
  [CommentError.COMMENT_NOT_FOUND]: {
    message: 'Comment not found',
    status: HttpStatus.NOT_FOUND,
  },
  [CommentError.ACCESS_DENIED]: {
    message: 'Comment is not yours',
    status: HttpStatus.FORBIDDEN,
  },
  
};
