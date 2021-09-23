import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenuTemplate = (currentMenuItem) => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional ${currentMenuItem === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}"
    data-menu-item="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  constructor(currentMenuItem) {
    super();
    this._currentMenuItem = currentMenuItem;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._currentMenuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (!evt.target.dataset.menuItem) {
      return;
    }
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
