import {createElement} from '../util';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container">
    <!--Здесь будет список фильмов-->
  </div>`
);

export default class FilmsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsContainerTemplate(this._filmListClass, this._title, this._titleClass);
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
