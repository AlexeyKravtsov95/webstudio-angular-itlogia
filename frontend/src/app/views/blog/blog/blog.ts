import { Component, HostListener, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ArticlesInterface } from '../../../interfaces/articles.interface';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { ActiveParamsInterface } from '../../../interfaces/active-params.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ActiveParamsUtil } from '../../../shared/utils/active-params.util';
import { ArticlesService } from '../../../shared/services/articles';
import { CategoryInterface } from '../../../interfaces/category.interface';
import { CategoryService } from '../../../shared/services/category.services';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog',
  imports: [ArticleCard, MatProgressSpinner],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private articlesService: ArticlesService = inject(ArticlesService);
  private categoryService: CategoryService = inject(CategoryService);

  pages: number[] = [];
  activeParams: ActiveParamsInterface = { categories: [] };
  articles: WritableSignal<ArticlesInterface[]> = signal<ArticlesInterface[]>([]);
  categories: CategoryInterface[] = [];
  sortingOpen: WritableSignal<boolean> = signal<boolean>(false);
  categoriesLoading: WritableSignal<boolean> = signal<boolean>(false);
  categoriesLoaded: WritableSignal<boolean> = signal<boolean>(false);
  categoriesError: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCategories();
    this.activatedRoute.queryParams.pipe(debounceTime(150)).subscribe((params) => {
      this.activeParams = ActiveParamsUtil.processParams(params);
      this.syncCategory();
      this.loadAllArticles();
    });
    this.loadAllArticles();
  }

  loadAllArticles(): void {
    this.articlesService.getArticles(this.activeParams).subscribe((articles) => {
      this.pages = [];
      for (let i = 1; i <= articles.pages; i++) {
        this.pages.push(i);
      }

      this.articles.set(articles.items);
    });
  }

  loadCategories(): void {
    if (this.categoriesLoaded() || this.categoriesLoading()) {
      return;
    }
    this.categoriesLoading.set(true);
    this.categoriesError.set(false);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map((category) => ({
          ...category,
          selected: this.activeParams.categories.includes(category.url),
        }));
        this.categoriesLoaded.set(true);
        this.categoriesLoading.set(false);
      },
      error: () => {
        this.categoriesError.set(true);
        this.categoriesLoading.set(false);
      },
    });
  }

  toggleSorting(event?: MouseEvent): void {
    event?.stopPropagation();
    this.sortingOpen.update((open) => !open);

    if (!this.categoriesLoaded() && !this.categoriesLoading()) {
      this.loadCategories();
    }
  }

  toggleCategories(category: CategoryInterface, event?: MouseEvent): void {
    event?.stopPropagation();
    const isSelected: boolean = this.activeParams.categories.includes(category.url);
    const categories: string[] = isSelected
      ? this.activeParams.categories.filter((url) => url !== category.url)
      : [...this.activeParams.categories, category.url];

    this.applyCategories(categories);
  }

  removeCategories(categoryUrl: string, event?: MouseEvent): void {
    event?.stopPropagation();
    const categories: string[] = this.activeParams.categories.filter((url) => url !== categoryUrl);
    this.applyCategories(categories);
  }

  openPage(page: number): void {
    this.activeParams.page = page;

    this.router
      .navigate(['/blog'], {
        queryParams: this.activeParams,
      })
      .then();
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router
        .navigate(['/blog'], {
          queryParams: this.activeParams,
        })
        .then();
    }
  }

  openNextPage(): void {
    const currentPage: number = this.activeParams.page ?? 1;
    const lastPage: number = this.pages[this.pages.length - 1] ?? 1;

    if (currentPage < lastPage) {
      this.activeParams.page = currentPage + 1;

      this.router
        .navigate(['/blog'], {
          queryParams: this.activeParams,
        })
        .then();
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.sortingOpen() && !target.closest('.blog-sorting')) {
      this.sortingOpen.set(false);
    }
  }

  private applyCategories(categories: string[]): void {
    this.activeParams = {
      ...this.activeParams,
      categories,
      page: 1,
    };

    this.syncCategory();

    this.router
      .navigate(['/blog'], {
        queryParams: this.buildQuery(this.activeParams),
      })
      .then();
  }

  private buildQuery(params: ActiveParamsInterface): Params {
    const queryParams: Params = {};
    if (params.categories.length) {
      queryParams['categories'] = params.categories;
    }

    if (params.page && params.page > 1) {
      queryParams['page'] = params.page;
    }

    return queryParams;
  }

  private syncCategory(): void {
    if (!this.categories.length) {
      return;
    }

    const selected = new Set(this.activeParams.categories);
    this.categories = this.categories.map((category) => ({
      ...category,
      selected: selected.has(category.url),
    }));
  }
}
