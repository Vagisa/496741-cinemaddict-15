import AbstractView from './abstract';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">
      All movies. Upcoming
    </h2>
  </section>`
);

export default class FilmsList extends AbstractView{
  getTemplate() {
    return createFilmsListTemplate();
  }
}
