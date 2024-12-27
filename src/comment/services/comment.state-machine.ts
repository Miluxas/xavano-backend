import { createMachine } from "xstate";
import { CommentStatus } from "../entities";

const commentStateMachine = createMachine({
  id: "comment",
  initial: CommentStatus.PENDING,
  states: {
    [CommentStatus.PENDING]: {
      on: {
        APPROVE: CommentStatus.APPROVED,
        DISAPPROVE: CommentStatus.DISAPPROVED,
      },
    },
    [CommentStatus.APPROVED]: {
      on: {
        DISAPPROVE: CommentStatus.DISAPPROVED,
      },
    },
    [CommentStatus.DISAPPROVED]: {
      on: {
        APPROVE: CommentStatus.APPROVED,
      },
    },
  },
});
