export const createProfileRatingTemplate = (films) => {
  const moviesWatched = films.filter((element) => element.isHistory).length;
  let userRank = '';
  if (moviesWatched === 0) {
    return '';
  } else if (moviesWatched > 21) {
    userRank = 'movie buff';
  } else if (moviesWatched >= 11) {
    userRank = 'fan';
  } else if (moviesWatched >= 1) {
    userRank = 'novice';
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
