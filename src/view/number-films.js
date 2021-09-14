import AbstractView from './abstract';

const createNumberFilmsTemplate = (films) => (
  `<p>
    ${films.length} movies inside
  </p>`
);

export default class NumberFilms extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createNumberFilmsTemplate(this._films);
  }
}
