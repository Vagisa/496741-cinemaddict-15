import {createElement} from '../util';

const createNoMoviesTextTemplate = (hashchange) => {
  const text = () => {
    switch (hashchange) {
      case 'all':
        return 'There are no movies in our database';
      case 'watchlist':
        return 'There are no movies to watch now';
      case 'history':
        return 'There are no watched movies now';
      case 'favorites':
        return 'There are no favorite movies now';
      default:
        return '';
    }
  };

  return `<h2 class="films-list__title">
    ${text()}
  </h2>`;
};

export default class NoMoviesText {
  constructor(tab = 'all') {
    this._tab = tab;
    this._element = null;
  }

  getTemplate() {
    return createNoMoviesTextTemplate(this._tab);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
