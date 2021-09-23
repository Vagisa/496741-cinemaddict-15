import AbstractObserver from '../utils/abstract-observer.js';
import {MenuItem} from '../const.js';

export default class Menu extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = MenuItem.FILMS;
  }

  setFilter(updateType, filter) {

    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
