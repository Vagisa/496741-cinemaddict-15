import SortView from '../view/sort.js';
import ContentView from '../view/content.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import FilmsListView from '../view/film-list.js';
import FilmsExtraView from '../view/films-extra.js';
import FilmsContainerView from '../view/films-container.js';
import LoadingView from '../view/loading.js';
import NoMoviesTextView from '../view/no-movies-text.js';
import FilmPresenter from './film.js';
import PopupView from '../view/popup.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from '../const.js';
import {filter} from '../utils/filter.js';
import dayjs from 'dayjs';
import FilmsModel from '../model/films.js';

const NUMBER_MOVIES_PER_STEP = 5;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;

export default class FilmList {
  constructor(contentContainer, filmsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._contentContainer = contentContainer;
    this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    this._comments = [];
    this._bodyElement = document.querySelector('body');

    this._filmPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._showMoreFilmsBtnComponent = null;
    this._filmsExtraComponent = null;
    this._oldExtraComponent = null;
    this._noMoviesTextComponent = null;
    this._popupScroll = 0;
    this._sortComponent = new SortView(this._currentSortType);
    this._contentComponent = new ContentView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._loadingComponent = new LoadingView();

    this._renderPopup = this._renderPopup.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._getCommentsAndOpenPopup = this._getCommentsAndOpenPopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init() {
    this._renderContent();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearContent();
    remove(this._sortComponent);
    remove(this._filmsListComponent);
    remove(this._filmsExtraComponent);
    remove(this._contentComponent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._filterModel.setFilter(FilterType.ALL);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[this._filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort((first, second) => dayjs(second.date).diff(dayjs(first.date)));
      case SortType.RATING:
        return filteredFilms.sort((first, second) => (second.rating - first.rating));
    }
    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update, film) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
            this._renderPopup(update, this._comments, true, true);
          });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, film)
          .then(({comments, movie}) => {
            const updatedFilm = FilmsModel.adaptToClient(movie);
            this._filmsModel.updateFilm(
              updateType,
              updatedFilm,
            );
            this._comments = comments;
            this._renderPopup(updatedFilm, comments, true, false);
          })
          .catch(() => {
            this._renderPopup(film, this._comments, true, true);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            const updatedFilm = {
              ...film,
              comments: film.comments.filter((commentId) => commentId !== update),
            };
            this._filmsModel.updateFilm(
              updateType,
              updatedFilm,
            );
            this._comments = this._comments.filter((comment) => comment.id !== update);
            this._renderPopup(film, this._comments, true, false);
          })
          .catch(() => {
            this._renderPopup(film, this._comments, true, true);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATH:
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearContent();
        this._renderContent();
        break;
      case UpdateType.MAJOR:
        this._clearContent({resetRenderFilmCount: true, resetSortType: true});
        this._renderContent();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderContent();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (this._renderedFilmsCount >= this._getFilms().length) {
      this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    }

    this._currentSortType = sortType;
    this._clearContent({resetRenderFilmCount: true});
    this._renderContent();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = new SortView(this._currentSortType);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
      render(this._contentContainer, this._sortComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderContent() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const films = this._getFilms();
    const filmCount = films.length;
    if (filmCount === 0) {
      this._renderNoFilmsText();
      return;
    }
    this._renderSort();
    this._renderFilmList();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmsCount)));

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreBtn();
    }
  }

  _renderLoading() {
    render(this._contentContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilmsText() {
    this._noMoviesTextComponent = new NoMoviesTextView(this._filterType);
    render(this._contentContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._noMoviesTextComponent, RenderPosition.BEFOREEND);
  }

  _clearContent({resetRenderFilmCount = false, resetSortType = false} = {}) {

    const filmCount = this._getFilms().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._filmsContainerComponent);
    remove(this._loadingComponent);
    remove(this._noMoviesTextComponent);
    remove(this._sortComponent);
    remove(this._oldExtraComponent);
    remove(this._filmsExtraComponent);
    remove(this._showMoreFilmsBtnComponent);

    if (this._noMoviesTextComponent) {
      render(this._noMoviesTextComponent);
    }

    if (resetRenderFilmCount) {
      this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilms(films, container = this._filmsContainerComponent) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderFilmList() {
    render(this._contentContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    const topRatedFilms = this._filmsModel.getFilms()
      .sort((first, second) => (second.rating - first.rating))
      .slice(0, NUMBER_TOP_RATED);
    this._renderFilmListExtra(topRatedFilms, 'Top rated');

    const mostCommentedFilms = this._filmsModel.getFilms()
      .sort((first, second) => (second.comments.length - first.comments.length))
      .slice(0, NUMBER_MOST_COMMENTED);
    this._renderFilmListExtra(mostCommentedFilms, 'Most commented');
  }

  _getCommentsAndOpenPopup(film, restoreScroll, shake) {
    this._api.getComments(film).then((comments) => {
      this._comments = comments;
      this._renderPopup(film, comments, restoreScroll, shake);
    });
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this._handleViewAction,
      this._getCommentsAndOpenPopup,
      this._closePopup,
    );
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _renderPopup(film, comments, restoreScroll, shake) {
    if (this._popupComponent) {
      this._popupScroll = this._popupComponent._element.scrollTop;
      this._closePopup();
    }

    this._popupComponent = new PopupView(film, comments, shake);
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.add('hide-overflow');
    if (restoreScroll) {
      this._popupComponent._element.scroll(0, this._popupScroll);
    }

    this._popupComponent.setPopupCloseClick(this._closePopup);
    this._popupComponent.setFavoriteClickHandler((update) => this._handleFavoriteClick(update));
    this._popupComponent.setWatchlistClickHandler((update) => this._handleWatchlistClick(update));
    this._popupComponent.setHistoryClickHandler((update) => this._handleHistoryClick(update));
    this._popupComponent.setAddCommentHandler((update) => this._handleAddNewComment(update, film));
    this._popupComponent.setDeleteCommentHandler((update) => this._handleDeleteComment(update, film));
  }

  _closePopup() {
    remove(this._popupComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.remove('hide-overflow');
    this._popupComponent = null;
  }

  _handleShowMoreBtnClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + NUMBER_MOVIES_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);
    this._renderFilms(films);

    this._renderedFilmsCount = newRenderedFilmCount;

    if(this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreFilmsBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreFilmsBtnComponent !== null) {
      this._showMoreFilmsBtnComponent = null;
    }
    this._showMoreFilmsBtnComponent = new ShowMoreBtnView();
    this._showMoreFilmsBtnComponent.setShowMoreBtn(this._handleShowMoreBtnClick);
    render(this._filmsListComponent, this._showMoreFilmsBtnComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmListExtra(films, title) {
    this._oldExtraComponent = this._filmsExtraComponent;
    this._filmsExtraComponent = new FilmsExtraView(title);
    render(this._contentComponent, this._filmsExtraComponent, RenderPosition.BEFOREEND);
    const filmsExtraContainerComponent = new FilmsContainerView();
    render(this._filmsExtraComponent, filmsExtraContainerComponent, RenderPosition.BEFOREEND);
    this._renderFilms(films, filmsExtraContainerComponent);
  }

  _handleFavoriteClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      Object.assign({}, film, {isFavorites: !film.isFavorites}),
    );
  }

  _handleHistoryClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign({}, film, {isHistory: !film.isHistory}),
    );
  }

  _handleWatchlistClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign({}, film, {isWatchlist: !film.isWatchlist}),
    );
  }

  _handleAddNewComment(comment, film) {
    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment,
      film,
    );
  }

  _handleDeleteComment(commentId, film) {
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      commentId,
      film,
    );
  }
}
