import AbstractView from './abstract';
import {FilterType} from '../const';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return `<h2 class="films-list__title">${noFilmTextValue}</h2>`;
};

export default class NoMoviesText extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoMoviesTemplate(this._data);
  }
}
