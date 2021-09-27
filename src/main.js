import RatingView from './view/rating.js';
import StatisticsView from './view/statistics.js';
import NumberFilmsView from './view/number-films.js';
import FilmListPresenter from './presenter/film-list.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic lgkhj67glshlghflg';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel, api);
let statisticComponent;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS: {
      if (filmListPresenter) {
        filmListPresenter.destroy();
      }
      statisticComponent = new StatisticsView(filmsModel);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
    }
    case MenuItem.FILMS:
      if (statisticComponent) {
        remove(statisticComponent);
      }
      filmListPresenter.init();
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);
filterPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new RatingView(filmsModel), RenderPosition.BEFOREEND);
    render(footerStatisticsElement, new NumberFilmsView(filmsModel), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(siteHeaderElement, new RatingView(filmsModel), RenderPosition.BEFOREEND);
    render(footerStatisticsElement, new NumberFilmsView(filmsModel), RenderPosition.BEFOREEND);
  });
