import AbstractView from './abstract';

const createPopupBottomTemplate = () => (
  `<div class="film-details__bottom-container">
  </div>`
);

export default class PopupBottom extends AbstractView{
  getTemplate() {
    return createPopupBottomTemplate();
  }
}
