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
  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.getPopularMovies();

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((query) => {
        if (query.trim()) {
          this.performSearch(query);
        } else {
          this.getPopularMovies();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  getPopularMovies(): void {
    this.movieService
      .getPopularMovies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.popularItems = response.results.map((item) => ({
            ...item,
            media_type: item.media_type || 'movie',
          }));
        },
        error: (error) => {
          console.error(
            'Error on popular item fetch :',
            error,
          );
        },
      });
  }

  performSearch(query: string): void {
    this.movieService
      .searchMedia(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.popularItems = response.results.filter(
            (item) => item.media_type !== 'person',
          );
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
}
