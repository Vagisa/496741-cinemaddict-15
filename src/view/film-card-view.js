import dayjs from 'dayjs';
import {createElement} from '../util';

const createFilmCardTemplate = (film) => {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    numberOfComments,
    isWatchlist,
    isHistory,
    isFavorites,
  } = film;
  const year = dayjs(date).format('YYYY');

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${numberOfComments} comments</a>
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

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
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
