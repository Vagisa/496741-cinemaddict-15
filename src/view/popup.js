import dayjs from 'dayjs';
import AbstractView from './abstract';

const createPopupTemplate = (film) => {
  const {
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    country,
    actors,
    director,
    writers,
    isWatchlist,
    isHistory,
    isFavorites,
  } = film;

  const releaseDate = dayjs(date).format('D MMMM YYYY');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                ${genres.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join(' ')}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button
          film-details__control-button--watchlist
          ${isWatchlist? 'film-details__control-button--active': ''}"
          id="watchlist" name="watchlist">
            Add to watchlist
          </button>
          <button type="button" class="film-details__control-button
          film-details__control-button--watched
          ${isHistory? 'film-details__control-button--active': ''}"
          id="watched" name="watched">
            Already watched
          </button>
          <button type="button" class="film-details__control-button
          film-details__control-button--favorite
          ${isFavorites? 'film-details__control-button--active': ''}"
          id="favorite" name="favorite">
            Add to favorites
          </button>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._popupCloseClick = this._popupCloseClick.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  _popupCloseClick(evt) {
    evt.preventDefault();
    this._callback.popupClose();
  }

  setPopupCloseClick(callback) {
    this._callback.popupClose = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._popupCloseClick);
  }
}
