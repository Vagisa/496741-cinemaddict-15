import AbstractView from './abstract';
import {RankFilmCount} from '../const';

const createRatingTemplate = (films) => {
  const moviesWatched = films.filter((element) => element.isHistory).length;
  let userRank = '';
  if (moviesWatched === RankFilmCount.NO_MOVIES) {
    return '';
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

export default class Rating extends AbstractView {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel.getFilms();
  }

  getTemplate() {
    return createRatingTemplate(this._filmsModel);
  }
}
