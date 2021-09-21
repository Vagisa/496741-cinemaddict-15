import AbstractView from './abstract';
import {FilterType} from '../const';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (FilterType) => {
  const noFilmTextValue = NoFilmsTextType[FilterType];

  return `<h2 class="films-list__title">${noFilmTextValue}</h2>`;
};

export default class NoMoviesText extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
    // this._tabChangeCallback = this._tabChangeCallback.bind(this);
  }

  getTemplate() {
    return createNoMoviesTemplate(this._data);
  }

  // _getText() {
  //   switch (this._tab) {
  //     case 'all':
  //       return 'There are no movies in our database';
  //     case 'watchlist':
  //       return 'There are no movies to watch now';
  //     case 'history':
  //       return 'There are no watched movies now';
  //     case 'favorites':
  //       return 'There are no favorite movies now';
  //     default:
  //       return '';
  //   }
  // }

  _tabChangeCallback(evt) {
    this._tab = `${evt.newURL.split('#')[1]}`;
    this._element.textContent = this._getText();
  }

  setHashchangeListener() {
    window.addEventListener('hashchange', this._tabChangeCallback);
  }
}
