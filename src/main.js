import {createProfileRatingTemplate} from './view/user-rank.js';
import {createMenuTemplate} from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createContentTemplate} from './view/content.js';
import {createNumberFilmsTemplate} from './view/number-films.js';
import {renderMovieList} from './models/render-movie-list.js';
import {createMovieInfoPopup} from './view/popup-movie-info.js';
import {createShowMoreButton} from './view/show-more-button.js';
import {getFilmTemplate} from './view/popup-film-details';
import {generateFilm, generateComment} from './mock/film-data.js';
import {filmDetailsControls} from './view/popup-film-controls';
import {filmComment} from './view/popup-film-comments.js';

const NUMBER_ALL_MOVIES = 5;
const NUMBER_TOP_RATED = 2;
const NUMBER_MOST_COMMENTED = 2;
const COMMENTS_COUNT = 4;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');


render(siteHeaderElement, createProfileRatingTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createContentTemplate(), 'beforeend');
render(footerStatisticsElement, createNumberFilmsTemplate(), 'beforeend');
render(bodyElement, createMovieInfoPopup(), 'beforeend');

const filmDetailsElement = document.querySelector('.film-details__top-container');
render(filmDetailsElement, getFilmTemplate(generateFilm()), 'beforeend');
render(filmDetailsElement, filmDetailsControls(generateFilm()), 'beforeend');

const commentsListElement = document.querySelector('.film-details__comments-list');
const commentsArray = new Array(COMMENTS_COUNT).fill().map(() => filmComment(generateComment()));
render(commentsListElement, commentsArray, 'beforeend');

const filmListElement = siteMainElement.querySelector('.films-list');
render(filmListElement, createShowMoreButton(), 'beforeend');

const filmsListContainerElement = document.querySelector('.films-list__container');
renderMovieList(filmsListContainerElement, NUMBER_ALL_MOVIES);

const filmsListExtraContainerElement = document.querySelector('.films-list--extra').querySelector('.films-list__container');
renderMovieList(filmsListExtraContainerElement, NUMBER_TOP_RATED);

const filmsLastChildContainerElement = document.querySelector('.films-list--extra:last-child').querySelector('.films-list__container');
renderMovieList(filmsLastChildContainerElement, NUMBER_MOST_COMMENTED);
