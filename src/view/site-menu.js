import AbstractView from './abstract';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<a href="#${name}" class="main-navigation__item
    ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
      ${type}
      ${type !== 'All movies' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`);
};
const createMenuTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterTemplate(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentFilterType === 'Stats' ? 'main-navigation__additional--active' : ''}"
    data-filter-type="Stats">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
