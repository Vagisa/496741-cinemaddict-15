import {createElement} from '../util';

const createPopupBottomTemplate = () => (
  `<div class="film-details__bottom-container">
  </div>`
);

export default class PopupBottom {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPopupBottomTemplate();
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
