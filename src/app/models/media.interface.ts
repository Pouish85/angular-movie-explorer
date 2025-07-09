export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  original_language: string;
  original_title?: string;
  original_name?: string;
  popularity: number;
  vote_count: number;
  media_type?: string;
}

export interface MediaApiResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

export interface MediaDetails extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
}
