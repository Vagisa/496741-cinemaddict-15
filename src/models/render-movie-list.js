import {createFilmModel} from './film-model.js';
import FilmPresenter from '../presenter/film-presenter.js';
import {generateFilm} from '../mock/film-data.js';

export const renderMovieList = (container, numberArrayElements) => {
  const filmModel = createFilmModel();
  const arrayOfFilms = new Array(numberArrayElements).fill().map(generateFilm);
  arrayOfFilms.forEach((element) => {filmModel.addNewFilm(element);});
  new FilmPresenter(container, filmModel).render();
};
