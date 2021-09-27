import SmartView from './smart.js';
import {RankFilmCount} from '../const.js';

const createRatingTemplate = (films) => {
  const moviesWatched = films.filter((element) => element.isHistory).length;
  let userRank = '';
  if (moviesWatched === RankFilmCount.NO_MOVIES) {
    userRank = '';
  } else if (moviesWatched > RankFilmCount.BUFF) {
    userRank = 'movie buff';
  } else if (moviesWatched >= RankFilmCount.FAN) {
    userRank = 'fan';
  } else if (moviesWatched >= RankFilmCount.NOVICE) {
    userRank = 'novice';
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Rating extends SmartView {
  constructor(filmsModel) {
    super();
    this._data = {films: filmsModel.getFilms()};
    this._filmsModel = filmsModel;

    this._handleFilmsUpdate = this._handleFilmsUpdate.bind(this);

    this._filmsModel.addObserver(this._handleFilmsUpdate);
  }

  _handleFilmsUpdate() {
    this.updateData({films: this._filmsModel.getFilms()});
  }

  restoreHandlers() {
    // У нас нет обработчиков в этом компоненте
  }

  getTemplate() {
    return createRatingTemplate(this._data.films);
  }
}
