import {render, RenderPosition, remove} from '../utils/render.js';
import ContentView from '../view/content.js';
import ShowMoreBtnView from '../view/show-more-button.js';
import FilmsListView from '../view/film-list.js';
import FilmsExtraView from '../view/film-list-extra.js';
import FilmsContainerView from '../view/films-container.js';
import NoMoviesTextView from '../view/no-movies.js';
import FilmPresenter from './film.js';

const NUMBER_MOVIES_PER_STEP = 5;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;

export default class FilmList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = NUMBER_MOVIES_PER_STEP;

    this._contentComponent = new ContentView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._showMoreBtnComponent = new ShowMoreBtnView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(moviesData, commentsArray) {
    this._moviesData = moviesData.slice();
    this._commentsArray = commentsArray.slice();

    render(this._filmsContainer, this._contentComponent, RenderPosition.BEFOREEND);
    render(this._contentComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderContent();
  }

  _renderContent() {
    if (this._moviesData.length === 0) {
      this._renderNoFilmsText();
    } else {
      this._renderFilmsContent();
    }
  }

  _renderNoFilmsText() {
    const noMoviesTextComponent = new NoMoviesTextView();
    render(this._filmsListComponent, noMoviesTextComponent, RenderPosition.BEFOREEND);
    noMoviesTextComponent.setHashchangeListener();
  }

  _renderFilmsContent() {
    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(this._moviesData.length, NUMBER_MOVIES_PER_STEP); i++) {
      this._renderFilm(this._moviesData[i], this._filmsContainerComponent);
    }

    if (this._moviesData.length > NUMBER_MOVIES_PER_STEP) {
      this._renderShowMoreBtn();
    }

    const topRatedFilms = this._moviesData.sort((first, second) => (second.rating - first.rating)).slice(0, NUMBER_TOP_RATED);
    this._renderFilmListExtra(topRatedFilms, 'Top rated');

    const mostCommentedFilms = this._moviesData.sort((first, second) => (second.numberOfComments - first.numberOfComments)).slice(0, NUMBER_MOST_COMMENTED);
    this._renderFilmListExtra(mostCommentedFilms, 'Most commented');
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(container);
    filmPresenter.init(film, this._commentsArray);
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
    const filmsExtraComponent = new FilmsExtraView(title);
    render(this._contentComponent, filmsExtraComponent, RenderPosition.BEFOREEND);
    const filmsExtraContainerComponent = new FilmsContainerView();
    render(filmsExtraComponent, filmsExtraContainerComponent, RenderPosition.BEFOREEND);
    films.forEach((film) => {
      this._renderFilm(film, filmsExtraContainerComponent);
    });
  }
}
