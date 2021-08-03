import {createModel} from './film-model.js';
import FilmPresenter from '../presenter/film-presenter.js';

export const renderMovieList = (container, arrayOfFilms) => {
  const filmModel = createModel();
  arrayOfFilms.forEach((element) => {filmModel.addNewFilm(element);});
  new FilmPresenter(container, filmModel).render();
};
