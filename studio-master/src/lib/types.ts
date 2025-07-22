export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genres: string[];
  runtime: number;
  cast: string[]; // Note: This is likely an array of strings in your current Movie type, but TMDB returns an array of objects for cast. You might need to adjust this later.
  trailer_url: string; // Note: TMDB does not provide a direct trailer_url in the main movie details response. This needs to be fetched separately.
  full_movie_url: string; // Note: TMDB does not provide full movie URLs.
}
