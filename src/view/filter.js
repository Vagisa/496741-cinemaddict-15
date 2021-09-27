import AbstractView from './abstract';
import {MenuItem, FilterType} from '../const';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<a href="#${name}" class="main-navigation__item
    ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}" data-menu-item="${MenuItem.FILMS}">
      ${type}
      ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`);
};

const createFiltersTemplate = (filters, currentFilterType, currentPage) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType)).join('');
  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional ${currentPage === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}"
      data-filter-type="All movies"
      data-menu-item="${MenuItem.STATISTICS}">Stats</a>
    </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType, currentPage) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentPage = currentPage;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter, this._currentPage);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const filterType = evt.target.dataset.filterType;
    if (filterType) {
      this._callback.filterTypeChange(filterType);
    }
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const currentPage = evt.target.dataset.menuItem;
    this._currentPage = currentPage;
    this._callback.menuClick(currentPage);
  }
}
