import AbstractView from './abstract';

const createContentTemplate = () => (
  `<section class="films">
  </section>`
);

export default class Content extends AbstractView {
  getTemplate() {
    return createContentTemplate();
  }
}
