import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MediaDetails } from '../../models/media.interface';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.scss'],
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  mediaDetail: MediaDetails | null = null;
  mediaId: number | null = null;
  mediaType: 'movie' | 'tv' | null = null;
  imageUrlBase = 'https://image.tmdb.org/t/p/original';
  private unsubscribe$ = new Subject<void>();

  imageUrlBaseDetail = 'https://image.tmdb.org/t/p/w780';
  imageUrlBaseBackdrop = 'https://image.tmdb.org/t/p/original';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          const urlSegments = this.route.snapshot.url;
          const type = urlSegments[0].path === 'movie' ? 'movie' : 'tv';

          this.mediaId = id;
          this.mediaType = type;

          if (isNaN(id) || id === 0) {
            console.error('ID invalid :', params.get('id'));
            return new Subject<MediaDetails | null>();
          }

          return this.movieService.getMediaDetails(id, type);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (data) => {
          this.mediaDetail = data;
        },
        error: (error) => {
          console.error('Error on media detail fetch :', error);
          this.mediaDetail = null;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  getBackdropUrl(backdropPath: string | null): string {
    return backdropPath ? `${this.imageUrlBase}${backdropPath}` : '';
  }

  getPosterUrl(posterPath: string | null): string {
    return posterPath
      ? `${this.imageUrlBase}${posterPath}`
      : 'assets/placeholder.jpg';
  }

  getGenresList(): string {
    if (
      this.mediaDetail &&
      this.mediaDetail.genres &&
      this.mediaDetail.genres.length > 0
    ) {
      return this.mediaDetail.genres.map((g) => g.name).join(', ');
    }
    return 'N/A';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
