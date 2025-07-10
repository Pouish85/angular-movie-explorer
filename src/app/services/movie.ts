import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaApiResponse, MediaDetails } from '../models/media.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl: string = environment.tmdbApiBaseUrl;
  private apiKey: string = environment.tmdbApiKey;
  private language: string = 'fr-FR';

  constructor(private http: HttpClient) {}

  /**
   * Fetch popular movies list.
   * @param page
   * @returns movies list.
   */
  getPopularMovies(page: number = 1): Observable<MediaApiResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.language)
      .set('page', page.toString());
    return this.http.get<MediaApiResponse>(`${this.apiUrl}/movie/popular`, {
      params,
    });
  }

  /**
   * Fetch popular Tv shows list.
   * @param page
   * @returns TV shows list.
   */
  getPopularTvShows(page: number = 1): Observable<MediaApiResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.language)
      .set('page', page.toString());
    return this.http.get<MediaApiResponse>(`${this.apiUrl}/tv/popular`, {
      params,
    });
  }

  /**
   * Fetch details of a specific movie or TV show.
   * @param id Media ID.
   * @param mediaType Media type, either 'movie' or 'tv'.
   * @returns Media details.
   */
  getMediaDetails(
    id: number,
    mediaType: 'movie' | 'tv',
  ): Observable<MediaDetails> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'fr-FR');

    return this.http.get<MediaDetails>(`${this.apiUrl}/${mediaType}/${id}`, {
      params,
    });
  }

  /**
   * Search for movies and TV shows by keyword.
   * Use the /search/multi endpoint for combined results.
   * @param query
   * @param page
   * @returns
   */
  searchMedia(query: string, page: number = 1): Observable<MediaApiResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'fr-FR')
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<MediaApiResponse>(`${this.apiUrl}/search/multi`, {
      params,
    });
  }
}
