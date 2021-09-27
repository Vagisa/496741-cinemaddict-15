import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
};
