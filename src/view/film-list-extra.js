import {createElement} from '../util';

const createFilmsExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

{/* <section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container">
  </div>
</section>

<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container">
  </div>
</section>  */}

export default class FilmsExtra {
  constructor(title) {
    this.title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this.title);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}