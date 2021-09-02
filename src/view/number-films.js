import {createElement} from '../util';

const createNumberFilmsTemplate = (films) => (
  `<p>
    ${films.length} movies inside
  </p>`
);

export default class NumberFilms {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createNumberFilmsTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
