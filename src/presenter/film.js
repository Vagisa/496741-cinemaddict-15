import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup.js';
import PopupBottomView from '../view/popup-bottom.js';
import PopupCommentsView from '../view/popup-comments.js';
import CommentView from '../view/popup-film-comment.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {generateComment} from '../mock/film-data.js';

export default class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._popupComponent = null;
    this._bodyElement = document.querySelector('body');

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(film) {
    this._film = film;

    const prevfilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;
    this._popupBottomComponent = new PopupBottomView();
    this._filmComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setPopupOpenClick(() => {
      this._renderPopup();
    });

    if (prevfilmComponent === null) {
      this._comments = new Array(this._film.numberOfComments).fill().map(generateComment);

      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.getElement().contains(prevfilmComponent.getElement())) {
      replace(this._filmComponent, prevfilmComponent);
    }

    if (!(prevPopupComponent === null)) {
      remove(prevPopupComponent);
      this._renderPopup();
    }
    remove(prevfilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _renderPopup() {
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');

    this._popupComponent.setPopupCloseClick(this._closePopup);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._renderPopupBottom();
    this._renderPopupComments();
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _renderPopupBottom() {
    const formElement = this._popupComponent.getElement().querySelector('.film-details__inner');
    render(formElement, this._popupBottomComponent, RenderPosition.BEFOREEND);
  }

  _renderPopupComments() {
    const popupCommentsComponent = new PopupCommentsView(this._film);
    render(this._popupBottomComponent, popupCommentsComponent, RenderPosition.BEFOREEND);
    const commentsListElement = popupCommentsComponent.getElement().querySelector('.film-details__comments-list');
    this._comments.forEach((comment) => render(commentsListElement, new CommentView(comment), RenderPosition.BEFOREEND));
  }

  _closePopup() {
    remove(this._popupComponent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorites: !this._film.isFavorites,
        },
      ),
    );
  }

  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isHistory: !this._film.isHistory,
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        },
      ),
    );
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }
}
