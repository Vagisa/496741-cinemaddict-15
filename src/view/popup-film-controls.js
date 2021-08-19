export const filmDetailsControls = (film) => (
  `<section class="film-details__controls">
  <button type="button" class="film-details__control-button
  film-details__control-button--watchlist
  ${film.isWatchlist? 'film-details__control-button--active': ''}"
  id="watchlist" name="watchlist">
    Add to watchlist
  </button>
  <button type="button" class="film-details__control-button
  film-details__control-button--watched
  ${film.isHistory? 'film-details__control-button--active': ''}"
  id="watched" name="watched">
    Already watched
  </button>
  <button type="button" class="film-details__control-button
  film-details__control-button--favorite
  ${film.isFavorites? 'film-details__control-button--active': ''}"
  id="favorite" name="favorite">
    Add to favorites
  </button>
</section>`
);
