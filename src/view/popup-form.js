import {createElement} from '../util';

const createPopupFormTemplate = () => (
  `<form class="film-details__inner" action="" method="get">
  </form>`
);

export default class PopupForm {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPopupFormTemplate();
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
