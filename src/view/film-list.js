import AbstractView from './abstract';

const createFilmsTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">
      All movies. Upcoming
    </h2>
  </section>`
);

export default class Films extends AbstractView{
  getTemplate() {
    return createFilmsTemplate();
  }
}
