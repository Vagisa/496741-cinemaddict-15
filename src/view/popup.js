import SmartView from './smart';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import he from 'he';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);

const createCommentTemplate = ({
  id,
  author,
  comment,
  date,
  emotion,
}) => {
  const commentDate = dayjs(date).fromNow();

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}">
          Delete
        </button>
      </p>
    </div>
  </li>`;
};

const createPopupCommentsTemplate = (
  comments,
  emotion,
  newText,
  isComments,
  isDisabled,
  commentsArray) => (
  `<section class="film-details__comments-wrap">
    ${isComments ?
    `<h3 class="film-details__comments-title">
      Comments
      <span class="film-details__comments-count">
        ${comments.length}
      </span>
    </h3>` : ''}

    <ul class="film-details__comments-list">
      <!--Здесь будут комментарии-->
      ${commentsArray.map((comment) => createCommentTemplate(comment)).join('')}
    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}"></img>` : '' }
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment" ${isDisabled ? 'disabled' : ''}>${newText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji" type="radio" id="emoji-smile" value="smile"
        ${isDisabled ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"
        ${isDisabled ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji"type="radio" id="emoji-puke" value="puke"
        ${isDisabled ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji" type="radio" id="emoji-angry" value="angry"
        ${isDisabled ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>`
);

const createPopupTemplate = (data, film, commentsArray, shake) => {
  const {
    newText,
    emoji,
    isComments,
    isDisabled,
  } = data;

  const {
    title,
    alternativeTitle,
    ageRating,
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
    comments,
    isWatchlist,
    isHistory,
    isFavorites,
  } = film;

  const commentsTemplate = createPopupCommentsTemplate(
    comments,
    emoji,
    newText,
    isComments,
    isDisabled,
    commentsArray,
  );
  const releaseDate = dayjs(date).format('D MMMM YYYY');
  const filmDuration = dayjs
    .duration(duration, 'minutes')
    .format('H[h] mm[m]');

  return `<section class="film-details">
    <form class="film-details__inner ${shake? 'shake' : ''}" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
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
                <td class="film-details__cell">${filmDuration}</td>
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
      <div class="film-details__bottom-container">${commentsTemplate}</div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
  constructor(film, comments, shake) {
    super();
    this._data = {
      isComments: film.comments.length !== 0,
      isDisabled: false,
      newText: '',
    };
    this._film = film;
    this._comments = comments;
    this._shake = shake;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._popupCloseClick = this._popupCloseClick.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._newCommentInputHandler = this._newCommentInputHandler.bind(this);
    this._emojiSelectionHandler = this._emojiSelectionHandler.bind(this);
    this._addNewCommentHandler = this._addNewCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  updateData(...args) {
    const scroll = this._element.scrollTop;
    super.updateData(...args);
    this._element.scroll(0, scroll);
  }

  getTemplate() {
    const shake = this._shake;
    this._shake = false;
    return createPopupTemplate(this._data, this._film, this._comments, shake);
  }

  setFavoriteClickHandler(callback) {
    this._callback._favoriteClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback._historyClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._historyClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback._watchlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setPopupCloseClick(callback) {
    this._callback.popupClose = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._popupCloseClick);
  }


  setAddCommentHandler(callback) {
    this._callback._addComment = callback;
    this._element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._addNewCommentHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback._deleteComment = callback;
    this._element.querySelectorAll('.film-details__comment-delete')
      .forEach((element) => element.addEventListener('click', this._deleteCommentHandler));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((elem) => elem.addEventListener('click', this._emojiSelectionHandler));
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._newCommentInputHandler);
    this.getElement().querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._addNewCommentHandler);
  }

  _emojiSelectionHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value,
    });
  }

  _addNewCommentHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      const commentText = he.escape(evt.target.value);
      evt.preventDefault();
      const comment = {
        comment: commentText,
        emotion: this._data.emoji,
      };
      this.updateData({isDisabled: true});
      this._callback._addComment(comment);
    }
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    evt.target.textContent = 'Deleting...';
    evt.target.disabled = true;
    this._callback._deleteComment(commentId);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback._favoriteClick(this._film);
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback._historyClick(this._film);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback._watchlistClick(this._film);
  }

  _popupCloseClick(evt) {
    evt.preventDefault();
    this._callback.popupClose();
  }

  _newCommentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newText: evt.target.value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._film);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setPopupCloseClick(this._callback.popupClose);
    this.setFavoriteClickHandler(this._callback._favoriteClick);
    this.setHistoryClickHandler(this._callback._historyClick);
    this.setWatchlistClickHandler(this._callback._watchlistClick);
    this.setAddCommentHandler(this._callback._addComment);
    this.setDeleteCommentHandler(this._callback._deleteComment);
  }
}
