import dayjs from 'dayjs';

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const FilmCardView = function (film) {
  this._element = null;
  this._film = film;
};

FilmCardView.prototype.getTemplate = function () {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    numberOfComments,
  } = this._film;

  const year = dayjs(date).format('YYYY');

  return `
    <article class="film-card">
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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

FilmCardView.prototype.getElement = function () {
  if (!this._element) {
    this._element = createElement(this.getTemplate());
  }

  return this._element;
};

export default FilmCardView;
