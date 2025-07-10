import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie';
import { MediaCardComponent } from '../../shared/media-card/media-card';
import { Media } from '../../models/media.interface';
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  popularItems: Media[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  currentMode: 'popular' | 'search' = 'popular';
  currentSearchQuery: string = '';
  isLoading: boolean = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.searchService.searchQuery$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((query) => {
        this.currentPage = 1;
        this.currentSearchQuery = query;
        if (query.trim()) {
          this.currentMode = 'search';
        } else {
          this.currentMode = 'popular';
        }
        this.loadContent();
      });

    this.loadContent();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  loadContent(): void {
    this.isLoading = true;
    if (this.currentMode === 'popular') {
      this.getPopularMovies();
    } else if (this.currentMode === 'search') {
      this.performSearch(this.currentSearchQuery);
    }
  }

  getPopularMovies(): void {
    this.movieService
      .getPopularMovies(this.currentPage)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.popularItems = response.results.map((item) => ({
            ...item,
            media_type: item.media_type || 'movie',
          }));
          this.totalPages = response.total_pages;
        },
        error: (error) => {
          console.error('Error on popular item fetch :', error);
          this.popularItems = [];
        },
      });
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.getPopularMovies();
      return;
    }
    this.movieService
      .searchMedia(query, this.currentPage)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.popularItems = response.results.filter(
            (item) => item.media_type !== 'person',
          );
          this.totalPages = response.total_pages;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche :', error);
          this.popularItems = [];
        },
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
