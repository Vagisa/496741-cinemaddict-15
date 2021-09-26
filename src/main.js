import RatingView from './view/user-rank.js';
import StatisticsView from './view/statistics.js';
import NumberFilmsView from './view/number-films.js';
import FilmListPresenter from './presenter/film-list.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {generateFilm} from './mock/film-data.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem} from './const.js';
import Api from './api.js';

const NUMBER_ALL_MOVIES = 15;
const AUTHORIZATION = 'Basic lgkhj67glshlghflg';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  console.log(moviesData);
  console.log(films);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(moviesData);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new RatingView(moviesData), RenderPosition.BEFOREEND);
let filmsPresenter;
let statisticComponent;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS: {
      if (filmsPresenter) {
        filmsPresenter.destroy();
      }
      statisticComponent = new StatisticsView(filmsModel);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
    }
    case MenuItem.FILMS:
      if (statisticComponent) {
        statisticComponent.destroy();
        remove(statisticComponent);
      }
      filmsPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
      filmsPresenter.init();
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);
filterPresenter.init();

render(footerStatisticsElement, new NumberFilmsView(moviesData), RenderPosition.BEFOREEND);
