import {createProfileRatingTemplate} from './view/user-rank.js';
import {createMenuTemplate} from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createContentTemplate} from './view/content.js';
import {createNumberFilmsTemplate} from './view/number-films.js';
import {createMovieInfoPopup} from './view/popup-movie-info.js';
import {createShowMoreButton} from './view/show-more-button.js';
import {getFilmTemplate} from './view/popup-film-details';
import {generateFilm, generateComment} from './mock/film-data.js';
import {filmDetailsControls} from './view/popup-film-controls';
import {filmComment} from './view/popup-film-comments.js';
import {getFilmCardTemplate} from './view/film-card-view.js';

const NUMBER_ALL_MOVIES = 15;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;
const NUMBER_MOVIES_PER_STEP = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);
const commentsArray = new Array(moviesData[0].numberOfComments).fill().map(() => filmComment(generateComment())).join('');

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');


render(siteHeaderElement, createProfileRatingTemplate(moviesData), 'beforeend');
render(siteMainElement, createMenuTemplate(moviesData), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createContentTemplate(), 'beforeend');
render(footerStatisticsElement, createNumberFilmsTemplate(moviesData), 'beforeend');
render(bodyElement, createMovieInfoPopup(moviesData[0]), 'beforeend');

const mainNavigationElement = document.querySelectorAll('.main-navigation__item');
mainNavigationElement.forEach((element) => {
  element.addEventListener('click', () => {
    mainNavigationElement.forEach((item) => {
      item.classList.remove('main-navigation__item--active');
    });
    element.classList.add('main-navigation__item--active');
  });
});

const sortButtonElement = document.querySelectorAll('.sort__button');
sortButtonElement.forEach((element) => {
  element.addEventListener('click', () => {
    sortButtonElement.forEach((item) => {
      item.classList.remove('sort__button--active');
    });
    element.classList.add('sort__button--active');
  });
});

const filmDetailsElement = document.querySelector('.film-details__top-container');
render(filmDetailsElement, getFilmTemplate(moviesData[0]), 'beforeend');
render(filmDetailsElement, filmDetailsControls(generateFilm()), 'beforeend');

const commentsListElement = document.querySelector('.film-details__comments-list');
render(commentsListElement, commentsArray, 'beforeend');

const popupCloseBtn = document.querySelector('.film-details__close-btn');

popupCloseBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  const popup = document.querySelector('.film-details');
  popup.remove();
});


const filmsListContainerElement = document.querySelector('.films-list__container');
for (let i = 0; i < Math.min(moviesData.length, NUMBER_MOVIES_PER_STEP); i++) {
  render(filmsListContainerElement, getFilmCardTemplate(moviesData[i]), 'beforeend');
}

const filmListElement = siteMainElement.querySelector('.films-list');
if (moviesData.length > NUMBER_MOVIES_PER_STEP) {
  let renderedFilmsCount = NUMBER_MOVIES_PER_STEP;

  render(filmListElement, createShowMoreButton(), 'beforeend');

  const showMoreBtn = document.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    moviesData.slice(renderedFilmsCount, renderedFilmsCount + NUMBER_MOVIES_PER_STEP).forEach((movie) => render(filmsListContainerElement, getFilmCardTemplate(movie), 'beforeend'));

    renderedFilmsCount += NUMBER_MOVIES_PER_STEP;

    if(renderedFilmsCount >= moviesData.length) {
      showMoreBtn.remove();
    }
  });
}

const filmsListExtraContainerElement = document.querySelector('.films-list--extra').querySelector('.films-list__container');
const topRated = moviesData.slice().sort((first, second) => (second.rating - first.rating)).slice(0, NUMBER_TOP_RATED);
render(filmsListExtraContainerElement, topRated.map(getFilmCardTemplate).join(''), 'beforeend');

const filmsLastChildContainerElement = document.querySelector('.films-list--extra:last-child').querySelector('.films-list__container');
const mostCommented = moviesData.slice().sort((first, second) => (second.numberOfComments - first.numberOfComments)).slice(0, NUMBER_MOST_COMMENTED);
render(filmsLastChildContainerElement, mostCommented.map(getFilmCardTemplate).join(''), 'beforeend');
