import dayjs from 'dayjs';
import AbstractView from './abstract';

const createCommentTemplte = (comment) => {
  const {
    author,
    commentOnFilm,
    date,
    emotion,
  } = comment;
  const commentDate = dayjs(date).format('YYYY/MM/DD HH:MM');

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${commentOnFilm}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class Comment extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplte(this._comment);
  }
}
