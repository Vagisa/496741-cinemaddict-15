import AbstractView from './abstract';

const createMenuTemplate = (films) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">
        Watchlist
        <span class="main-navigation__item-count">
          ${films.filter((element) => element.isWatchlist).length}
        </span>
      </a>
      <a href="#history" class="main-navigation__item">
        History
        <span class="main-navigation__item-count">
          ${films.filter((element) => element.isHistory).length}
        </span>
      </a>
      <a href="#favorites" class="main-navigation__item">
        Favorites
        <span class="main-navigation__item-count">
        ${films.filter((element) => element.isFavorites).length}
        </span>
      </a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }
}
