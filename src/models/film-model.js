export const createFilmModel = () => {
  let films = [];

  const addNewFilm = ({
    title,
    rating,
    date,
    duration,
    genres,
    poster,
    description,
    numberOfComments,
    country,
    actors,
  }) => (
    films.push({
      title,
      rating,
      date,
      duration,
      genres,
      poster,
      description,
      numberOfComments,
      country,
      actors,
    })
  );

  const clearFilms = () => (films = []);

  const getFilms = () => films;

  return {
    addNewFilm,
    clearFilms,
    getFilms,
  };
};
