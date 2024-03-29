import AbstractObserver from '../utils/abstract-observer.js';
import {RankFilmCount} from '../const.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getUserRank() {
    const moviesWatched = this._films.filter((element) => element.isHistory).length;
    if (moviesWatched === RankFilmCount.NO_MOVIES) {
      return '';
    } else if (moviesWatched > RankFilmCount.BUFF) {
      return 'movie buff';
    } else if (moviesWatched >= RankFilmCount.FAN) {
      return 'fan';
    } else if (moviesWatched >= RankFilmCount.NOVICE) {
      return 'novice';
    }
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update not existing film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    return {
      id: film.id,
      comments: film.comments,
      title: film['film_info'].title,
      alternativeTitle: film['film_info']['alternative_title'],
      ageRating: film['film_info']['age_rating'],
      rating: film['film_info']['total_rating'],
      date: film['film_info'].release.date,
      duration: film['film_info'].runtime,
      genres: film['film_info'].genre,
      poster: film['film_info'].poster,
      description: film['film_info'].description,
      country: film['film_info'].release.release_country,
      actors: film['film_info'].actors,
      director: film['film_info'].director,
      writers: film['film_info'].writers,
      isWatchlist: film['user_details'].watchlist,
      isHistory: film['user_details']['already_watched'],
      isFavorites: film['user_details'].favorite,
      watchingDate: film['user_details']['watching_date'],
    };
  }

  static adaptToServer(film) {
    return {
      id: film.id,
      comments: film.comments,
      'film_info': {
        title: film.title,
        'alternative_title': film.alternativeTitle,
        'age_rating': film.ageRating,
        'total_rating': film.rating,
        runtime: film.duration,
        genre: film.genres,
        poster: film.poster,
        description: film.description,
        actors: film.actors,
        director: film.director,
        writers: film.writers,
        release: {
          date: film.date,
          'release_country': film.country,
        },
      },
      'user_details': {
        watchlist: film.isWatchlist,
        'already_watched': film.isHistory,
        favorite: film.isFavorites,
        'watching_date': film.watchingDate,
      },
    };
  }
}
