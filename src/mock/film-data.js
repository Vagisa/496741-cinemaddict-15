import {
  getRandomArrayElement,
  getArraySpecifiedLength,
  getRandomInteger,
  getRandomFloat,
  generateDate
} from '../util.js';

const filmTitles = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const filmDescriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const filmActors = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Audrey Hepburn',
  'John Joseph Travolta',
  'Uma Thurman',
  'Marilyn Monroe',
  'Monica Bellucci',
  'Johnny Depp',
  'Brad Pitt',
];

const filmGenres = ['Musical', 'Western', 'Drama', 'Cartoon', 'Comedy', 'Mystery'];

const filmCountrys = ['USA', 'Russia', 'England', 'France', 'Italy'];

const filmEmotions = ['smile', 'sleeping', 'puke', 'angry'];

const commentAuthors = [
  'Joe Dassin',
  'Mireille Mathieu',
  'Alizee',
  'Lara Fabian',
  'Vanessa Paradis',
  'Ricchi e Poveri',
];

const commentTexts = [
  'A Toi',
  'Pardonne moi',
  'Moi Lolita',
  'Karma',
  'La seine',
  'Cosa sei',
];


const pikUpPosterForMovie = (title) => {
  switch (title) {
    case 'The Dance of Life':
      return 'the-dance-of-life.jpg';
    case 'Sagebrush Trail':
      return 'sagebrush-trail.jpg';
    case 'The Man with the Golden Arm':
      return 'the-man-with-the-golden-arm.jpg';
    case 'Santa Claus Conquers the Martians':
      return 'santa-claus-conquers-the-martians.jpg';
    case 'Popeye the Sailor Meets Sindbad the Sailor':
      return 'popeye-meets-sinbad.png';
    case 'The Great Flamarion':
      return 'the-great-flamarion.jpg';
    case 'Made for Each Other':
      return 'made-for-each-other.png';
    default:
      return null;
  }
};

const generateFilm = () => {
  const movieTitle = getRandomArrayElement(filmTitles);

  return {
    title: movieTitle,
    rating: getRandomFloat(0, 10, 1),
    date: generateDate(),
    duration: `${getRandomInteger(0, 4)}h ${getRandomInteger(0, 59)}m`,
    genres: getArraySpecifiedLength(filmGenres, 1, filmGenres.length),
    poster: `./images/posters/${pikUpPosterForMovie(movieTitle)}`,
    description: getArraySpecifiedLength(filmDescriptions, 1, 5).join(' '),
    numberOfComments: getRandomInteger(0, 5),
    country: getRandomArrayElement(filmCountrys),
    actors: getArraySpecifiedLength(filmActors, 1, filmActors.length).join(' '),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
    isFavorites: Boolean(getRandomInteger(0, 1)),
  };
};

const generateComment = () => ({
  id: getRandomInteger(0, 100),
  author: getRandomArrayElement(commentAuthors),
  commentOnFilm: getRandomArrayElement(commentTexts),
  date: generateDate(),
  emotion: getRandomArrayElement(filmEmotions),
});

export {generateFilm, generateComment};
