import MenuView from '../view/site-menu.js';
import SortView from '../view/sort.js';
import ContentView from '../view/content.js';
import ShowMoreBtnView from '../view/show-more-button.js';
import FilmsListView from '../view/film-list.js';
import FilmsExtraView from '../view/film-list-extra.js';
import FilmsContainerView from '../view/films-container.js';
import NoMoviesTextView from '../view/no-movies.js';
import FilmPresenter from './film.js';
import PopupView from '../view/popup.js';
// import CommentsModel from './model/comments.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import dayjs from 'dayjs';

const NUMBER_MOVIES_PER_STEP = 5;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;

export default class FilmList {
  constructor(contentContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._contentContainer = contentContainer;
    this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    this._bodyElement = document.querySelector('body');
    this._currentSortType = SortType.DEFAULT;

    // this._sortComponent = null;
    this._sortComponent = new SortView(this._currentSortType);
    this._showMoreBtnComponent = null;
    this._filmsExtraComponent = null;
    this._oldExtraComponent = null;
    this._filmPresenter = new Map();
    //this._commentsModel = new CommentsModel();
    this._contentComponent = new ContentView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._noMoviesTextComponent = new NoMoviesTextView();

    this._renderPopup = this._renderPopup.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeEvent = this._handleModeEvent.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._closePopup = this._closePopup.bind(this);

    this._filmsModel.addObserver(this._handleModeEvent);
  }

  init() {
    this._renderMenu();
    this._renderContent();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice()
          .sort((first, second) => dayjs(second.date).diff(dayjs(first.date)));
      case SortType.RATING:
        return this._filmsModel.getFilms().slice()
          .sort((first, second) => (second.rating - first.rating));
    }
    return this._filmsModel.getFilms();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updatefilm(updateType, update);
        break;
      case UserAction.ADD_FILM:
        this._filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this._filmsModel.deleteFilm(updateType, update);
        break;
      // case UserAction.ADD_COMMENT:
      //   this._commentsModel.addComment(updateType, update);
      //   break;
      // case UserAction.DELETE_COMMENT:
      //   this._commentsModel.deleteComment(updateType, update);
      //   break;
    }
  }

  _handleModeEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATH:
        //обновить часть
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        //обновить список
        this._clearContent();
        this._renderContent();
        break;
      case UpdateType.MAJOR:
        //обновить всю доску
        this._clearContent({resetRenderFilmCount: true, resetSortType: true});
        this._renderContent();
        break;
    }
  }

  _renderMenu() {
    render(this._contentContainer, new MenuView(this._getFilms()), RenderPosition.BEFOREEND);
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

  _renderNoFilmsText() {
    render(this._contentContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._noMoviesTextComponent, RenderPosition.BEFOREEND);
    this._noMoviesTextComponent.setHashchangeListener();
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    remove(this._showMoreBtnComponent);
  }

  _clearContent({resetRenderFilmCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._filmsContainerComponent);
    remove(this._sortComponent);
    remove(this._noMoviesTextComponent);
    remove(this._oldExtraComponent);
    remove(this._filmsExtraComponent);
    remove(this._showMoreBtnComponent);

    if (resetRenderFilmCount) {
      this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
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

    const topRatedFilms =this._getFilms().sort((first, second) => (second.rating - first.rating)).slice(0, NUMBER_TOP_RATED);
    this._renderFilmListExtra(topRatedFilms, 'Top rated');

    const mostCommentedFilms = this._getFilms().sort((first, second) => (second.comments.length - first.comments.length)).slice(0, NUMBER_MOST_COMMENTED);
    this._renderFilmListExtra(mostCommentedFilms, 'Most commented');
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this._handleViewAction,
      this._renderPopup,
      this._closePopup,
    );
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderPopup(film) {
    if (this._popupComponent) {
      this._closePopup();
    }
    // this._commentsModel.setComments(film.comments);

    this._popupComponent = new PopupView(film);
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');

    this._popupComponent.setPopupCloseClick(this._closePopup);
    this._popupComponent.setFavoriteClickHandler(() => this._handleFavoriteClick(film));
    this._popupComponent.setWatchlistClickHandler(() => this._handleWatchlistClick(film));
    this._popupComponent.setHistoryClickHandler(() => this._handleHistoryClick(film));
  }

  _closePopup() {
    remove(this._popupComponent);
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
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setShowMoreBtn(this._handleShowMoreBtnClick);
    render(this._filmsListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
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
    const scroll = this._popupComponent.getElement().scrollTop;
    this._handleViewAction(Object.assign({}, film, {isFavorites: !film.isFavorites}));
    this._popupComponent.getElement().scroll(0, scroll);
  }

  _handleHistoryClick(film) {
    const scroll = this._popupComponent.getElement().scrollTop;
    this._handleViewAction(Object.assign({}, film, {isHistory: !film.isHistory}));
    this._popupComponent.getElement().scroll(0, scroll);
  }

  _handleWatchlistClick(film) {
    const scroll = this._popupComponent.getElement().scrollTop;
    this._handleViewAction(Object.assign({}, film, {isWatchlist: !film.isWatchlist}));
    this._popupComponent.getElement().scroll(0, scroll);
  }
}
