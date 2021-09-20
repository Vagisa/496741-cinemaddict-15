import RatingView from './view/user-rank.js';
import NumberFilmsView from './view/number-films.js';
import FilmListPresenter from './presenter/film-list.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {generateFilm} from './mock/film-data.js';
import {setToggleButton} from './utils/util.js';
import {RenderPosition, render} from './utils/render.js';

const NUMBER_ALL_MOVIES = 15;

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(moviesData);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsPresenter = new FilmListPresenter(siteMainElement, filmsModel);

render(siteHeaderElement, new RatingView(moviesData), RenderPosition.BEFOREEND);

filmsPresenter.init();

render(footerStatisticsElement, new NumberFilmsView(moviesData), RenderPosition.BEFOREEND);

setToggleButton('main-navigation__item');
setToggleButton('sort__button');
