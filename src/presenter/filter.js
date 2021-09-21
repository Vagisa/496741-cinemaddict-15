import FilterView from '../view/site-menu';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {FilterType, UpdateType} from '../const';

export default class Filter {
  constructor (filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._currentFilterType = FilterType.ALL;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if(prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace (this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  // _getFilms() {
  //   this._filterType = this._filterModel.getFilter();
  //   const films = this._filmsModel.getFilms();
  //   const filteredFilms = filter[this._filterType](films);
  //   switch (this._currentFilterType) {
  //     case FilterType.FAVORITES:
  //       return filteredFilms.filter((film) => film.isFavorites);
  //     case FilterType.WATCHLIST:
  //       return filteredFilms.filter((film) => film.isWatchlist);
  //     case FilterType.HISTTORY:
  //       return filteredFilms.filter((film) => film.isHistory);
  //   }
  //   return filteredFilms;
  // }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTTORY,
        name: 'History',
        count: filter[FilterType.HISTTORY](films).length,
      },

    ];
  }
}

