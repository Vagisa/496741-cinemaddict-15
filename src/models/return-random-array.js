import {returnRandomNumber} from './return-random-number.js';

const getRandomArrayElement = (elements) => elements[returnRandomNumber(0, elements.length - 1)];

const getArrayRandomLength = (initialArrayElements) =>
{
  const firstElement = returnRandomNumber(0, initialArrayElements.length - 1);
  let secondElement = returnRandomNumber(1, initialArrayElements.length);

  if (firstElement === secondElement) {
    secondElement =+ 1;
  }
  if (firstElement > secondElement) {
    return initialArrayElements.slice(secondElement, firstElement);
  }
  return initialArrayElements.slice(firstElement, secondElement);
};

const getArraySpecifiedLength = (initialArrayElements, lengthFrom, lengthTo) =>
{
  const newArray = new Array(returnRandomNumber(lengthFrom, lengthTo)).fill().map(() =>
    getRandomArrayElement(initialArrayElements));

  return newArray;
};

export {getRandomArrayElement, getArrayRandomLength, getArraySpecifiedLength};
