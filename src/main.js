import RatingView from './view/user-rank.js';
import MenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import NumberFilmsView from './view/number-films.js';
import FilmListPresenter from './presenter/film-list.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import MenuModel from './model/menu.js';
import {generateFilm} from './mock/film-data.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';

const NUMBER_ALL_MOVIES = 15;

const moviesData = new Array(NUMBER_ALL_MOVIES).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(moviesData);

const filterModel = new FilterModel();
const menuModel = new MenuModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new RatingView(moviesData), RenderPosition.BEFOREEND);
const siteMenuComponent = new MenuView();
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);
let filmsPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel, menuModel);
let statisticComponent;

const handleSiteMenuClick = (menuItem) => {
  menuModel.setFilter(UpdateType.MAJOR, menuItem);
  switch (menuItem ) {
    case MenuItem.STATISTICS: {
      filmsPresenter.destroy();
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

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
filmsPresenter.init();

render(footerStatisticsElement, new NumberFilmsView(moviesData), RenderPosition.BEFOREEND);
