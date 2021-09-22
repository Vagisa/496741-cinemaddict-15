import FilmCardView from '../view/film-card-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class Film {
  constructor(
    filmContainer,
    changeData,
    popupOpen,
    popupClose) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._popupOpen = popupOpen;
    this._popupClose = popupClose;

    this._filmComponent = null;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevfilmComponent = this._filmComponent;
    this._filmComponent = new FilmCardView(this._film);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setPopupOpenClick(() => this._popupOpen(this._film));
    this._filmComponent.setEscKeyDown(() => this._popupClose(this._film));

    if (prevfilmComponent === null) {
      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.getElement().contains(prevfilmComponent.getElement())) {
      replace(this._filmComponent, prevfilmComponent);
    }

    remove(prevfilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        },
      ),
    );
  }

}
