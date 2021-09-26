import AbstractView from './abstract';

const createNumberFilmsTemplate = (films) => (
  `<p>
    ${films.length} movies inside
  </p>`
);

export default class NumberFilms extends AbstractView {
  constructor(filmsModel) {
    super();
    this._films = filmsModel.getFilms();
  }

  getTemplate() {
    return createNumberFilmsTemplate(this._films);
  }
}
