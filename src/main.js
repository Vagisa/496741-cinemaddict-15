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
import {render, RenderPosition, setToggleButton} from './util.js';

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

const onEscKeyDown = (evt) => {
  if (!popup) {
    return;
  }
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    popup.remove();
    bodyElement.classList.remove('hide-overflow');
    popup = null;
  }
};
document.addEventListener('keydown', onEscKeyDown);

const renderPopup = (film) => {
  if (popup) {
    return;
  }
  const popupComponent = new PopupView(film);
  render(bodyElement, popupComponent.getElement(), RenderPosition.BEFOREEND);
  bodyElement.classList.add('hide-overflow');
  const popupCloseBtn = popupComponent.getElement().querySelector('.film-details__close-btn');

  popup = document.querySelector('.film-details');
  popupCloseBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    popup.remove();
    bodyElement.classList.remove('hide-overflow');
    popup = null;
  });

  const formElement = popupComponent.getElement().querySelector('.film-details__inner');
  const popupBottomComponent = new PopupBottomView();
  render(formElement, popupBottomComponent.getElement(), RenderPosition.BEFOREEND);
  render(popupBottomComponent.getElement(), new PopupCommentsView(moviesData[0]).getElement(), RenderPosition.BEFOREEND);
  const commentsListElement = popupBottomComponent.getElement().querySelector('.film-details__comments-list');
  commentsArray.forEach((comment) => render(commentsListElement, new CommentView(comment).getElement(), RenderPosition.BEFOREEND));
};

const renderFilm = (filmContainer, film) => {
  const filmComponent = new FilmCardView(film);
  render(filmContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const openPopup = (openTagClass) => {
    filmComponent.getElement().querySelector(`.${openTagClass}`).addEventListener('click', () => {
      renderPopup(film);
    });
  };

  openPopup('film-card__title');
  openPopup('film-card__poster');
  openPopup('film-card__comments');
};

render(siteHeaderElement, new RatingView(moviesData).getElement(), RenderPosition.BEFOREEND);
const MenuComponent = new MenuView(moviesData);
render(siteMainElement, MenuComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const contentComponent = new ContentView();
render(siteMainElement, contentComponent.getElement(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsView();
render(contentComponent.getElement(), filmsComponent.getElement(), RenderPosition.BEFOREEND);

const renderFilmListExtra = (films, title) => {
  const filmsExtraComponent = new FilmsExtraView(title);
  render(contentComponent.getElement(), filmsExtraComponent.getElement(), RenderPosition.BEFOREEND);
  const filmsExtraContainerComponent = new FilmsContainerView();
  render(filmsExtraComponent.getElement(), filmsExtraContainerComponent.getElement(), RenderPosition.BEFOREEND);
  films.forEach((film) => {
    renderFilm(filmsExtraContainerComponent.getElement(), film);
  });
};

const renderFilmsContent = (arrayFilms, filmsContainer) => {
  render(filmsComponent.getElement(), filmsContainer.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(arrayFilms.length, NUMBER_MOVIES_PER_STEP); i++) {
    renderFilm(filmsContainer.getElement(), arrayFilms[i]);
  }

  if (arrayFilms.length > NUMBER_MOVIES_PER_STEP) {
    let renderedFilmsCount = NUMBER_MOVIES_PER_STEP;

    render(filmsComponent.getElement(), new ShowMoreBtnView().getElement(), RenderPosition.BEFOREEND);

    const showMoreBtn = document.querySelector('.films-list__show-more');
    showMoreBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      arrayFilms.slice(renderedFilmsCount, renderedFilmsCount + NUMBER_MOVIES_PER_STEP).forEach((movie) => {
        renderFilm(filmsContainer.getElement(), movie);
      });

      renderedFilmsCount += NUMBER_MOVIES_PER_STEP;

      if(renderedFilmsCount >= arrayFilms.length) {
        showMoreBtn.remove();
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
  render(filmsComponent.getElement(), noMoviesTextComponent.getElement(), RenderPosition.BEFOREEND);
  window.addEventListener(
    'hashchange',
    (event) => {
      const tab = `${event.newURL.split('#')[1]}`;
      filmsComponent.getElement().lastChild.remove();
      render(filmsComponent.getElement(), new NoMoviesTextView(tab).getElement(), RenderPosition.BEFOREEND);
    },
  );
} else {
  renderFilmsContent(moviesData, filmsContainerComponent);
}

render(footerStatisticsElement, new NumberFilmsView(moviesData).getElement(), RenderPosition.BEFOREEND);

setToggleButton('main-navigation__item');
setToggleButton('sort__button');
