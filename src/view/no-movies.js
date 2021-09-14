import AbstractView from './abstract';

export default class NoMoviesText extends AbstractView {
  constructor(tab = 'all') {
    super();
    this._tab = tab;
    this._tabChangeCallback = this._tabChangeCallback.bind(this);
  }

  getTemplate() {
    return `<h2 class="films-list__title">${this._getText()}</h2>`;
  }

  _getText() {
    switch (this._tab) {
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
  }

  _tabChangeCallback(evt) {
    this._tab = `${evt.newURL.split('#')[1]}`;
    this._element.textContent = this._getText();
  }

  setHashchangeListener() {
    window.addEventListener('hashchange', this._tabChangeCallback);
  }
}
