import {createProfileRatingTemplate} from './view/user-rank.js';
import {createMenuTemplate} from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createContentTemplate} from './view/content.js';
import {createNumberFilmsTemplate} from './view/number-films.js';
import {renderMovieList} from './models/render-movie-list.js';
import {createMovieInfoPopup} from './view/movie-info-popup.js';
import {createShowMoreButton} from './view/show-more-button.js';

const filmsMajor = [
  {
    title: 'The Dance of Life',
    rating: 8.3,
    year: 1929,
    duration: '1h 55m',
    genre: 'Musical',
    poster: './images/posters/the-dance-of-life.jpg',
    description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…',
    numberOfComments: 5,
  },
  {
    title: 'Sagebrush Trail',
    rating: 3.2,
    year: 1933,
    duration: '54m',
    genre: 'Western',
    poster: './images/posters/sagebrush-trail.jpg',
    description: 'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escap…',
    numberOfComments: 89,
  },
  {
    title: 'The Man with the Golden Arm',
    rating: 9.0,
    year: 1955,
    duration: '1h 59m',
    genre: 'Drama',
    poster: './images/posters/the-man-with-the-golden-arm.jpg',
    description: 'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…',
    numberOfComments: 18,
  },
  {
    title: 'Santa Claus Conquers the Martians',
    rating: 2.3,
    year: 1964,
    duration: '1h 21m',
    genre: 'Comedy',
    poster: './images/posters/santa-claus-conquers-the-martians.jpg',
    description: 'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…',
    numberOfComments: 465,
  },
  {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    rating: 6.3,
    year: 1936,
    duration: '16m',
    genre: 'Cartoon',
    poster: './images/posters/popeye-meets-sinbad.png',
    description: 'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…',
    numberOfComments: 0,
  }];

const topRatedFilms = [
  {
    title: 'The Man with the Golden Arm',
    rating: 9.0,
    year: 1955,
    duration: '1h 59m',
    genre: 'Drama',
    poster: './images/posters/the-man-with-the-golden-arm.jpg',
    description: 'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…',
    numberOfComments: 18,
  },
  {
    title: 'The Great Flamarion',
    rating: 8.9,
    year: 1945,
    duration: '1h 18m',
    genre: 'Mystery',
    poster: './images/posters/the-great-flamarion.jpg',
    description: 'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…',
    numberOfComments: 12,
  }];

const mostCommentedFilms = [
  {
    title: 'Santa Claus Conquers the Martians',
    rating: 2.3,
    year: 1964,
    duration: '1h 21m',
    genre: 'Comedy',
    poster: './images/posters/santa-claus-conquers-the-martians.jpg',
    description: 'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…',
    numberOfComments: 465,
  },
  {
    title: 'Made for Each Other',
    rating: 5.8,
    year: 1939,
    duration: '1h 32m',
    genre: 'Comedy',
    poster: './images/posters/made-for-each-other.png',
    description: 'John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well, and he has a chance of bei…',
    numberOfComments: 56,
  }];

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');


render(siteHeaderElement, createProfileRatingTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createContentTemplate(), 'beforeend');
render(footerStatisticsElement, createNumberFilmsTemplate(), 'beforeend');
render(bodyElement, createMovieInfoPopup(), 'beforeend');

const filmListElement = siteMainElement.querySelector('.films-list');
render(filmListElement, createShowMoreButton(), 'beforeend');

const filmsListContainerElement = document.querySelector('.films-list__container');
renderMovieList(filmsListContainerElement, filmsMajor);

const filmsListExtraContainerElement = document.querySelector('.films-list--extra').querySelector('.films-list__container');
renderMovieList(filmsListExtraContainerElement, topRatedFilms);

const filmsLastChildContainerElement = document.querySelector('.films-list--extra:last-child').querySelector('.films-list__container');
renderMovieList(filmsLastChildContainerElement, mostCommentedFilms);
