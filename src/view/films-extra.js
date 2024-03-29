import AbstractView from './abstract';

const createFilmsExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsExtra extends AbstractView {
  constructor(title) {
    super();
    this.title = title;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this.title);
  }
}
