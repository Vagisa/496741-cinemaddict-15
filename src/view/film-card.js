import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import AbstractView from './abstract';

dayjs.extend(durationPlugin);

const createFilmCardTemplate = (film) => {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    comments,
    isWatchlist,
    isHistory,
    isFavorites,
  } = film;
  const year = dayjs(date).format('YYYY');
  const filmDuration = dayjs
    .duration(duration, 'minutes')
    .format('H[h] mm[m]');

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${filmDuration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
      ${isWatchlist? 'film-card__controls-item--active': ''}" type="button">
        Add to watchlist
      </button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched
      ${isHistory? 'film-card__controls-item--active': ''}" type="button">
        Mark as watched
      </button>
      <button class="film-card__controls-item film-card__controls-item--favorite
      ${isFavorites? 'film-card__controls-item--active': ''}" type="button">
        Mark as favorite
      </button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._popupOpenClick = this._popupOpenClick.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback._favoriteClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback._historyClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback._watchlistClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback._favoriteClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback._historyClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._historyClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback._watchlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  _popupOpenClick(evt) {
    evt.preventDefault();
    this._callback.popupOpen();
  }

  setPopupOpenClick(callback) {
    this._callback.popupOpen = callback;
    this.getElement()
      .querySelectorAll('.film-card__title, .film-card__poster, .film-card__comments')
      .forEach(
        (element) => {
          element.addEventListener('click', this._popupOpenClick);
        },
      );
  }
}
