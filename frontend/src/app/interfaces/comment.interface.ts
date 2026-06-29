export interface AllCommentInterface {
  allCount: number;
  comments: CommentInterface[];
}

export interface CommentInterface {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
  };
}

export type CommentReactionAction = 'like' | 'dislike';
export type CommentAction = CommentReactionAction | 'violate';
export type CommentReaction = CommentReactionAction | null;
export interface UserCommentReactionInterface {
  comment: string;
  action: CommentReactionAction;
}
