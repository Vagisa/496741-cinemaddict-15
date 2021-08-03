import FilmCardView from '../view/film-card-view.js';

const FilmPresenter = function (element, model) {
  this._element = element;
  this._model = model;
};

FilmPresenter.prototype.render = function () {
  const newFragment = document.createDocumentFragment();
  this._element.innerHTML = '';

  this._model.getFilms().forEach((film) => {
    const filmCardView = new FilmCardView(film);
    const newElement = filmCardView.getElement();

    newFragment.appendChild(newElement);
  });
  this._element.appendChild(newFragment);
};

export default FilmPresenter;
