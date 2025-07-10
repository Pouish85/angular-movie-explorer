import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MovieService } from '../../services/movie';
import { MediaCardComponent } from '../../shared/media-card/media-card';
import { Media } from '../../models/media.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  popularItems: Media[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  currentMode: 'popular' | 'search' = 'popular';

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadContent();

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((query) => {
        if (query.trim()) {
          this.currentMode = 'search';
          this.performSearch(query);
        } else {
          this.currentMode = 'popular';
          this.getPopularMovies();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  loadContent(): void {
    if (this.currentMode === 'popular') {
      this.getPopularMovies();
    } else if (this.currentMode === 'search') {
      this.performSearch(this.searchQuery);
    }
  }

  getPopularMovies(): void {
    this.movieService
      .getPopularMovies(this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
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
        },
      });
  }

  performSearch(query: string): void {
    this.movieService
      .searchMedia(query, this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.popularItems = response.results.filter(
            (item) => item.media_type !== 'person',
          );
          this.totalPages = response.total_pages;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche :', error);
        },
      });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearchSubmit(): void {
    this.searchSubject.next(this.searchQuery);
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
