import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../../core/auth-service';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AllCommentInterface, CommentAction,
  CommentInterface,
  CommentReaction,
  CommentReactionAction,
  UserCommentReactionInterface,
} from '../../../interfaces/comment.interface';
import { CommentsServices } from '../../services/comments-services';
import { DefaultResponseInterface } from '../../../interfaces/default.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-comments',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private commentsService: CommentsServices = inject(CommentsServices);
  private readonly initialLimitComment: number = 3;
  private readonly nextLimitComment: number = 10;
  private _matSnackBar: MatSnackBar = inject(MatSnackBar);
  private reactionsRequestSeq: number = 0;
  private isReactionsLoading: boolean = false;

  allComments: CommentInterface[] = [];
  totalCount: number = 0;
  visibleCount: number = 0;

  isLoggedIn: boolean = false;
  isLoadingInitial: boolean = false;
  isLoadingMore: boolean = false;
  isSubmitting: boolean = false;

  userCommentsForm = this.formBuilder.group({
    text: ['', [Validators.minLength(10)]],
  });

  userReactions = new Map<string, CommentReactionAction>();

  get visibleComments(): CommentInterface[] {
    return this.allComments.slice(0, this.visibleCount);
  }

  get hasMoreComments(): boolean {
    return this.visibleCount < this.totalCount;
  }

  @Input() articleId: string = '';

  constructor() {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.loadComments();
  }

  loadComments(): void {
    if (!this.articleId) {
      return;
    }
    this.isLoadingInitial = true;

    this.commentsService.getComments(this.articleId, 0).subscribe({
      next: (data: DefaultResponseInterface | AllCommentInterface) => {
        this.isLoadingInitial = false;

        const response = data as DefaultResponseInterface;
        if (response.error) {
          this._matSnackBar.open(response.message);
          this.isLoadingInitial = false;
          return;
        }
        const comment: AllCommentInterface = data as AllCommentInterface;

        this.allComments = comment.comments;
        this.totalCount = comment.allCount;
        this.visibleCount = Math.min(this.initialLimitComment, this.totalCount);

        if (this.isLoggedIn && this.articleId) {
          this.loadUserReactions();
        } else {
          this.userReactions.clear();
        }

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoadingInitial = false;
        if (error.error && error.error.message) {
          this._matSnackBar.open(error.error.message);
        } else {
          this._matSnackBar.open('Не удалось загрузить комментарии');
        }
      },
    });
  }

  loadMoreComments(): void {
    if (!this.articleId || !this.hasMoreComments || this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.commentsService.getComments(this.articleId, this.allComments.length).subscribe({
      next: (data: DefaultResponseInterface | AllCommentInterface) => {
        const targetVisible = Math.min(this.visibleCount + this.nextLimitComment, this.totalCount);

        const response = data as DefaultResponseInterface;
        if (response.error) {
          this._matSnackBar.open(response.message);
          this.isLoadingMore = false;
          return;
        }

        while (this.allComments.length < targetVisible) {
          const batch: AllCommentInterface = data as AllCommentInterface;
          if (!batch.comments.length) {
            this.isLoadingMore = false;
            return;
          }

          this.totalCount = batch.allCount;
          this.allComments = [...this.allComments, ...batch.comments];
        }

        this.visibleCount = Math.min(targetVisible, this.allComments.length);
        this.isLoadingMore = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoadingMore = false;
        if (error.error && error.error.message) {
          this._matSnackBar.open(error.error.message);
        } else {
          this._matSnackBar.open('Не удалось загрузить комментарии');
        }
      },
    });
  }

  addComment(): void {
    if (!this.isLoggedIn || !this.articleId || this.isSubmitting) return;

    const text: string = this.userCommentsForm.value.text?.trim() ?? '';

    if (!text) {
      this.userCommentsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.commentsService.addComment(this.articleId, text).subscribe({
      next: (data: DefaultResponseInterface | AllCommentInterface) => {
        const response = data as DefaultResponseInterface;

        if (response.error) {
          this._matSnackBar.open(response.message);
          this.isSubmitting = false;
          return;
        }

        this.userCommentsForm.reset();
        this._matSnackBar.open('Комментарий добавлен');
        this.loadComments();
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (error.error && error.error.message) {
          this._matSnackBar.open(error.error.message);
        } else {
          this._matSnackBar.open('Не удалось добавить комментарий');
        }
      },
    });
  }

  getCommentReaction(commentId: string): CommentReaction {
    return this.userReactions.get(commentId) ?? null;
  }

  onLike(comment: CommentInterface): void {
    this.vote(comment, 'like');
  }

  onDislike(comment: CommentInterface): void {
    this.vote(comment, 'dislike');
  }

  onReport(comment: CommentInterface): void {
    if (!this.isLoggedIn) {
      this._matSnackBar.open("Для отправки жалобы, войдите в аккаунт");
      return;
    }

    if (this.isReactionsLoading) {
      return;
    }

    this.commentsService.applyCommentAction(comment.id, 'violate').subscribe({
      next: (data: DefaultResponseInterface) => {
        const response = data as DefaultResponseInterface;
        if (response.error) {
          this._matSnackBar.open(response.message);
          return;
        }

        this._matSnackBar.open("Жалоба отправлена");
      },
      error: (error: HttpErrorResponse) => {
        const message = error?.error?.message as string | undefined;
        if (message?.includes('уже применено')) {
          this._matSnackBar.open('Жалоба уже отправлена');
          return;
        }
        if (message) {
          this._matSnackBar.open(message);
        } else {
          this._matSnackBar.open('Не удалось отправить жалобу');
        }
      },
    });
  }

  private vote(comment: CommentInterface, action: CommentReactionAction): void {
    if (!this.isLoggedIn) {
      this._matSnackBar.open('Войдите в аккаунт, чтобы проставить оценку');
      return;
    }

    if (this.isReactionsLoading) {
      return;
    }

    this.commentsService.applyCommentAction(comment.id, action).subscribe({
      next: (data: DefaultResponseInterface | AllCommentInterface) => {
        const response = data as DefaultResponseInterface;
        if (response.error) {
          this._matSnackBar.open(response.message);
          return;
        }

        this.applyReactionState(comment, action);
        this._matSnackBar.open('Ваш голос учтен');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && error.error.message) {
          this._matSnackBar.open(error.error.message);
        } else {
          this._matSnackBar.open('Не удалось проставить голос');
        }
      },
    });
  }

  private applyReactionState(comment: CommentInterface, action: CommentReactionAction): void {
    const prevAction = this.userReactions.get(comment.id);

    if (prevAction === action) {
      if (action === 'like' && comment.likesCount > 0) comment.likesCount--;
      if (action === 'dislike' && comment.dislikesCount > 0) comment.dislikesCount--;
      this.userReactions.delete(comment.id);
      return;
    }

    if (prevAction === 'like' && comment.likesCount > 0) {
      comment.likesCount--;
    }
    if (prevAction === 'dislike' && comment.dislikesCount > 0) {
      comment.dislikesCount--;
    }

    if (action === 'like') {
      comment.likesCount++;
    } else {
      comment.dislikesCount++;
    }
    this.userReactions.set(comment.id, action);
  }

  private loadUserReactions(): void {
    if (!this.articleId || !this.isLoggedIn) return;

    const currentSeq = ++this.reactionsRequestSeq;
    this.isReactionsLoading = true;

    this.commentsService.getArticleCommentActions(this.articleId).subscribe({
      next: (actions: UserCommentReactionInterface[]) => {
        if (currentSeq !== this.reactionsRequestSeq) return;

        this.userReactions.clear();
        actions.forEach((item: UserCommentReactionInterface) => {
          if (item.action === 'like' || item.action === 'dislike') {
            this.userReactions.set(item.comment, item.action);
          }
        });

        this.isReactionsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (currentSeq !== this.reactionsRequestSeq) return;
        this.isReactionsLoading = false;
      },
    });
  }
}
