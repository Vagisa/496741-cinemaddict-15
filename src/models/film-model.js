export const createModel = () => {
  let films = [];

  const addNewFilm = ({
    title,
    rating,
    year,
    duration,
    genre,
    poster,
    description,
    numberOfComments,
  }) => (
    films.push({
      title,
      rating,
      year,
      duration,
      genre,
      poster,
      description,
      numberOfComments,
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
