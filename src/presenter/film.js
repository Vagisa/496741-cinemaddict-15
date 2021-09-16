import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup.js';
import PopupBottomView from '../view/popup-bottom.js';
import PopupCommentsView from '../view/popup-comments.js';
import CommentView from '../view/popup-film-comment.js';
import {render, RenderPosition, remove} from '../utils/render.js';

let popupElement = null;

export default class Film {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;

    this._popupBottomComponent = new PopupBottomView();
    this._bodyElement = document.querySelector('body');
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    this._popupComponent = new PopupView(this._film);
    this._renderFilm(this._film);
  }

  _renderFilm() {
    const filmComponent = new FilmCardView(this._film);
    render(this._filmContainer, filmComponent, RenderPosition.BEFOREEND);
    filmComponent.setPopupOpenClick(() => this._renderPopup(this._film));
  }

  _renderPopup() {
    if (popupElement) {
      return;
    }
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');

    popupElement = document.querySelector('.film-details');
    this._popupComponent.setPopupCloseClick(this._closePopup);

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
    popupElement.remove();
    popupElement = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (!popupElement) {
      return;
    }
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }
}
