import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'tv/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: '' },
];
