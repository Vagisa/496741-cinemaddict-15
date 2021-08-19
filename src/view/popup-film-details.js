import dayjs from 'dayjs';

export const getFilmTemplate = ({
  title,
  rating,
  date,
  duration,
  genres,
  poster,
  description,
  country,
  actors,
}) => {

  const releaseDate = dayjs(date).format('D MMMM YYYY');

  return `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="">

      <p class="film-details__age">18+</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">Anthony Mann</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actors}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${releaseDate}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${duration}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${country}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${genres.length > 1? 'Genres' : 'Genre'}</td>
          <td class="film-details__cell">
          ${genres.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join(' ')}
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">${description}</p>
    </div>
  </div>`;
};
