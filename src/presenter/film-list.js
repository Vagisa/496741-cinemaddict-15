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
import PopupBottomView from '../view/popup-bottom.js';
import PopupCommentsView from '../view/popup-comments.js';
import CommentView from '../view/comment.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import dayjs from 'dayjs';

const NUMBER_MOVIES_PER_STEP = 5;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;

export default class FilmList {
  constructor(contentContainer) {
    this._contentContainer = contentContainer;
    this._sortComponent = new SortView();
    this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    this._filmPresenter = new Map();
    this._bodyElement = document.querySelector('body');
    this._currentSortType = SortType.DEFAULT;

    this._filmsExtraComponent = null;
    this._oldExtraComponent = null;
    this._popupCommentsComponent = null;
    this._contentComponent = new ContentView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._showMoreBtnComponent = new ShowMoreBtnView();

    this._renderPopup = this._renderPopup.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(moviesData) {
    this._moviesData = moviesData.slice();
    this._sourcedMoviesData = moviesData.slice();
    this._popupBottomComponent = new PopupBottomView();

    this._renderMenu();
    this._renderSort();
    render(this._contentContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderContent();
  }

  _handleFilmChange(updatedFilm) {
    this._moviesData = updateItem(this._moviesData, updatedFilm);
    this._sourcedMoviesData = updateItem(this._sourcedMoviesData, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this._popupComponent && updatedFilm.id === this._popupComponent._film.id) {
      this._renderPopup(updatedFilm);
    }
  }

  _renderMenu() {
    render(this._contentContainer, new MenuView(this._moviesData), RenderPosition.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._moviesData.sort((first, second) => dayjs(second.date).diff(dayjs(first.date)));
        break;
      case SortType.RATING:
        this._moviesData.sort((first, second) => (second.rating - first.rating));
        break;
      default:
        this._moviesData = this._sourcedMoviesData.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (this._renderedFilmsCount >= this._moviesData.length) {
      this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    }
    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSort() {
    render(this._contentContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContent() {
    if (this._moviesData.length === 0) {
      this._renderNoFilmsText();
    } else {
      this._renderFilmList();
    }
  }

  _renderNoFilmsText() {
    const noMoviesTextComponent = new NoMoviesTextView();
    render(this._filmsListComponent, noMoviesTextComponent, RenderPosition.BEFOREEND);
    noMoviesTextComponent.setHashchangeListener();
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    remove(this._filmsContainerComponent);
    remove(this._oldExtraComponent);
    remove(this._filmsExtraComponent);
    remove(this._showMoreBtnComponent);
  }

  _renderFilmList() {
    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(this._moviesData.length, NUMBER_MOVIES_PER_STEP); i++) {
      this._renderFilm(this._moviesData[i], this._filmsContainerComponent);
    }

    if (this._moviesData.length > NUMBER_MOVIES_PER_STEP) {
      this._renderShowMoreBtn();
    }

    const topRatedFilms = this._moviesData.slice().sort((first, second) => (second.rating - first.rating)).slice(0, NUMBER_TOP_RATED);
    this._renderFilmListExtra(topRatedFilms, 'Top rated');

    const mostCommentedFilms = this._moviesData.slice().sort((first, second) => (second.comments.length - first.comments.length)).slice(0, NUMBER_MOST_COMMENTED);
    this._renderFilmListExtra(mostCommentedFilms, 'Most commented');
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this._handleFilmChange,
      this._renderPopup,
    );
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderPopup(film) {
    if (this._popupComponent) {
      this._closePopup();
    }
    this._popupComponent = new PopupView(film);
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');

    this._popupComponent.setPopupCloseClick(this._closePopup);
    this._popupComponent.setFavoriteClickHandler(() => this._handleFavoriteClick(film));
    this._popupComponent.setWatchlistClickHandler(() => this._handleWatchlistClick(film));
    this._popupComponent.setHistoryClickHandler(() => this._handleHistoryClick(film));
    this._renderPopupBottom();
    this._renderPopupComments(film);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _renderPopupBottom() {
    const formElement = this._popupComponent.getElement().querySelector('.film-details__inner');
    render(formElement, this._popupBottomComponent, RenderPosition.BEFOREEND);
  }

  _renderPopupComments(film) {
    this._popupCommentsComponent = new PopupCommentsView(film);
    render(this._popupBottomComponent, this._popupCommentsComponent, RenderPosition.BEFOREEND);
    const commentsListElement = this._popupCommentsComponent.getElement().querySelector('.film-details__comments-list');
    film.comments.forEach((comment) => render(commentsListElement, new CommentView(comment), RenderPosition.BEFOREEND));
  }

  _closePopup() {
    remove(this._popupComponent);
    remove(this._popupBottomComponent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._popupComponent = null;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleShowMoreBtnClick() {
    this._moviesData.slice(this._renderedFilmsCount, this._renderedFilmsCount + NUMBER_MOVIES_PER_STEP).forEach((movie) => {
      this._renderFilm(movie, this._filmsContainerComponent);
    });

    this._renderedFilmsCount += NUMBER_MOVIES_PER_STEP;

    if(this._renderedFilmsCount >= this._moviesData.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    render(this._filmsListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setShowMoreBtn(this._handleShowMoreBtnClick);
  }

  _renderFilmListExtra(films, title) {
    this._oldExtraComponent = this._filmsExtraComponent;
    this._filmsExtraComponent = new FilmsExtraView(title);
    render(this._contentComponent, this._filmsExtraComponent, RenderPosition.BEFOREEND);
    const filmsExtraContainerComponent = new FilmsContainerView();
    render(this._filmsExtraComponent, filmsExtraContainerComponent, RenderPosition.BEFOREEND);
    films.forEach((film) => {
      this._renderFilm(film, filmsExtraContainerComponent);
    });
  }

  _handleFavoriteClick(film) {
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          isFavorites: !film.isFavorites,
        },
      ),
    );
  }

  _handleHistoryClick(film) {
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          isHistory: !film.isHistory,
        },
      ),
    );
  }

  _handleWatchlistClick(film) {
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          isWatchlist: !film.isWatchlist,
        },
      ),
    );
  }
}
