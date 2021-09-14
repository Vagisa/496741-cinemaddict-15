import AbstractView from './abstract';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container">
    <!--Здесь будет список фильмов-->
  </div>`
);

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
