import SmartView from './smart.js';

const createRatingTemplate = (userRank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Rating extends SmartView {
  constructor(filmsModel) {
    super();
    this._data = {userRank: filmsModel.getUserRank()};
    this._filmsModel = filmsModel;

    this._handleFilmsUpdate = this._handleFilmsUpdate.bind(this);

    this._filmsModel.addObserver(this._handleFilmsUpdate);
  }

  getTemplate() {
    return createRatingTemplate(this._data.userRank);
  }

  _handleFilmsUpdate() {
    this.updateData({userRank: this._filmsModel.getUserRank()});
  }

  restoreHandlers() {
    // У нас нет обработчиков в этом компоненте
  }
}
