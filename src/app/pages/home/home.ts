import {Component, OnDestroy, OnInit} from '@angular/core';
import {Media} from '../../models/media.interface';
import {Subject, takeUntil} from 'rxjs';
import {MovieService} from '../../services/movie';
import {CommonModule} from '@angular/common';
import {MediaCardComponent} from '../../shared/media-card/media-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
  popularMovies: Media[] = [];
  private unsubscribe$ = new Subject();

  constructor(private movieServices: MovieService) { }

  ngOnInit(): void {
    this.getPopularMovies();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  getPopularMovies(): void {
    this.movieServices.getPopularMovies().pipe(takeUntil(this.unsubscribe$)).subscribe({ next: (response) => {
      this.popularMovies = response.results;
      console.log('Popular Movies:', this.popularMovies);
      },
    error: (error) => {
      console.error("Error fetching popular movies:", error);
    }})
  }
}
