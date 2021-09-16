import RatingView from './view/user-rank.js';
import MenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import NumberFilmsView from './view/number-films.js';
import FilmListPresenter from './presenter/film-list.js';
import {generateFilm, generateComment} from './mock/film-data.js';
import {setToggleButton} from './utils/util.js';
import {RenderPosition, render} from './utils/render.js';

const NUMBER_ALL_MOVIES = 15;

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);
const commentsArray = new Array(moviesData[0].numberOfComments).fill().map(generateComment);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsPresenter = new FilmListPresenter(siteMainElement);
render(siteHeaderElement, new RatingView(moviesData), RenderPosition.BEFOREEND);
const MenuComponent = new MenuView(moviesData);
render(siteMainElement, MenuComponent, RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
filmsPresenter.init(moviesData, commentsArray);
render(footerStatisticsElement, new NumberFilmsView(moviesData), RenderPosition.BEFOREEND);

setToggleButton('main-navigation__item');
setToggleButton('sort__button');
