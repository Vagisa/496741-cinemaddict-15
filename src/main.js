import RatingView from './view/user-rank.js';
import MenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import ContentView from './view/content.js';
import FilmsView from './view/film-list.js';
import NoMoviesTextView from './view/no-movies.js';
import FilmsContainerView from './view/films-container.js';
import FilmsExtraView from './view/film-list-extra.js';
import NumberFilmsView from './view/number-films.js';
import PopupView from './view/popup.js';
import PopupBottomView from './view/popup-bottom.js';
import PopupCommentsView from './view/popup-comments.js';
import ShowMoreBtnView from './view/show-more-button.js';
import CommentView from './view/popup-film-comment.js';
import FilmCardView from './view/film-card-view.js';
import {generateFilm, generateComment} from './mock/film-data.js';
import {setToggleButton} from './utils/util.js';
import {RenderPosition, render, remove} from './utils/render.js';

const NUMBER_ALL_MOVIES = 15;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;
const NUMBER_MOVIES_PER_STEP = 5;

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);
const commentsArray = new Array(moviesData[0].numberOfComments).fill().map(generateComment);

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

let popup = null;

const closePopup = () => {
  popup.remove();
  bodyElement.classList.remove('hide-overflow');
  popup = null;
};

const onEscKeyDown = (evt) => {
  if (!popup) {
    return;
  }
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const renderPopup = (film) => {
  if (popup) {
    return;
  }
  const popupComponent = new PopupView(film);
  render(bodyElement, popupComponent, RenderPosition.BEFOREEND);
  bodyElement.classList.add('hide-overflow');

  popup = document.querySelector('.film-details');
  popupComponent.setPopupCloseClick(() => {
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const formElement = popupComponent.getElement().querySelector('.film-details__inner');
  const popupBottomComponent = new PopupBottomView();
  render(formElement, popupBottomComponent, RenderPosition.BEFOREEND);
  render(popupBottomComponent, new PopupCommentsView(moviesData[0]), RenderPosition.BEFOREEND);
  const commentsListElement = popupBottomComponent.getElement().querySelector('.film-details__comments-list');
  commentsArray.forEach((comment) => render(commentsListElement, new CommentView(comment), RenderPosition.BEFOREEND));
  document.addEventListener('keydown', onEscKeyDown);
};

const renderFilm = (filmContainer, film) => {
  const filmComponent = new FilmCardView(film);
  render(filmContainer, filmComponent, RenderPosition.BEFOREEND);
  filmComponent.setPopupOpenClick(() => renderPopup(film));
};

render(siteHeaderElement, new RatingView(moviesData), RenderPosition.BEFOREEND);
const MenuComponent = new MenuView(moviesData);
render(siteMainElement, MenuComponent, RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);

const contentComponent = new ContentView();
render(siteMainElement, contentComponent, RenderPosition.BEFOREEND);

const filmsComponent = new FilmsView();
render(contentComponent, filmsComponent, RenderPosition.BEFOREEND);

const renderFilmListExtra = (films, title) => {
  const filmsExtraComponent = new FilmsExtraView(title);
  render(contentComponent, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsExtraContainerComponent = new FilmsContainerView();
  render(filmsExtraComponent, filmsExtraContainerComponent, RenderPosition.BEFOREEND);
  films.forEach((film) => {
    renderFilm(filmsExtraContainerComponent, film);
  });
};

const renderFilmsContent = (arrayFilms, filmsContainer) => {
  render(filmsComponent, filmsContainer, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(arrayFilms.length, NUMBER_MOVIES_PER_STEP); i++) {
    renderFilm(filmsContainer, arrayFilms[i]);
  }

  if (arrayFilms.length > NUMBER_MOVIES_PER_STEP) {
    let renderedFilmsCount = NUMBER_MOVIES_PER_STEP;
    const showMoreBtnComponent = new ShowMoreBtnView();
    render(filmsComponent, showMoreBtnComponent, RenderPosition.BEFOREEND);

    showMoreBtnComponent.setShowMoreBtn(() => {
      arrayFilms.slice(renderedFilmsCount, renderedFilmsCount + NUMBER_MOVIES_PER_STEP).forEach((movie) => {
        renderFilm(filmsContainer, movie);
      });

      renderedFilmsCount += NUMBER_MOVIES_PER_STEP;

      if(renderedFilmsCount >= arrayFilms.length) {
        remove(showMoreBtnComponent);
      }
    });
  }

  const topRatedFilms = arrayFilms.slice().sort((first, second) => (second.rating - first.rating)).slice(0, NUMBER_TOP_RATED);
  renderFilmListExtra(topRatedFilms, 'Top rated');

  const mostCommentedFilms = arrayFilms.slice().sort((first, second) => (second.numberOfComments - first.numberOfComments)).slice(0, NUMBER_MOST_COMMENTED);
  renderFilmListExtra(mostCommentedFilms, 'Most commented');
};


const filmsContainerComponent = new FilmsContainerView();
const noMoviesTextComponent = new NoMoviesTextView();
if (moviesData.length === 0) {
  render(filmsComponent, noMoviesTextComponent, RenderPosition.BEFOREEND);
  noMoviesTextComponent.setHashchangeListener();
} else {
  renderFilmsContent(moviesData, filmsContainerComponent);
}

render(footerStatisticsElement, new NumberFilmsView(moviesData), RenderPosition.BEFOREEND);

setToggleButton('main-navigation__item');
setToggleButton('sort__button');
