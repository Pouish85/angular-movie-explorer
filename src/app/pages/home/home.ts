import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../../models/media.interface';
import { Subject, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from '../../shared/media-card/media-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  popularMovies: Media[] = [];
  popularTvShows: Media[] = [];
  private unsubscribe$ = new Subject();

  constructor(private movieServices: MovieService) {}

  ngOnInit(): void {
    this.getPopularMovies();
    this.getPopularTvShows();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  getPopularMovies(): void {
    this.movieServices
      .getPopularMovies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.popularMovies = response.results.map((movie) => ({
            ...movie,
            media_type: 'movie',
          }));
        },
        error: (error) => {
          console.error('Error fetching popular movies:', error);
        },
      });
  }

  getPopularTvShows(): void {
    this.movieServices
      .getPopularTvShows()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.popularTvShows = response.results.map((tvShow) => ({
            ...tvShow,
            media_type: 'tv',
          }));
        },
        error: (error) => {
          console.error('Error fetching popular TV Shows:', error);
        },
      });
  }
}
