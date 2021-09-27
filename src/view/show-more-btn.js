import AbstractView from './abstract';

const createShowMoreBtnTemplate = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class ShowMoreBtn extends AbstractView {
  constructor() {
    super();
    this._showMoreBtn = this._showMoreBtn.bind(this);
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  setShowMoreBtn(callback) {
    this._callback.showMore = callback;
    this.getElement().addEventListener('click', this._showMoreBtn);
  }

  _showMoreBtn(evt) {
    evt.preventDefault();
    this._callback.showMore();
  }
}
