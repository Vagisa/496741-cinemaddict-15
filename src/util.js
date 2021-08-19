import dayjs from 'dayjs';

const getRandomInteger = (firstNumber, secondNumber) => {
  if (firstNumber < 0 || secondNumber < 0) {
    return NaN;
  }

  if (firstNumber > secondNumber) {
    return NaN;
  }

  return Math.round(Math.random() * (secondNumber - firstNumber) + firstNumber);
};

const getRandomFloat = (firstNumber, secondNumber, numberOfSings = 0) => {
  const rendomNumber = Math.random() * (secondNumber - firstNumber) + firstNumber;

  if (firstNumber < 0 || secondNumber < 0 || numberOfSings < 0) {
    return NaN;
  }

  if (firstNumber > secondNumber) {
    return NaN;
  }

  const multiplicator = Math.pow(10, numberOfSings);

  return Math.round(rendomNumber * multiplicator) / multiplicator;
};

const DAYS_IN_YEAR = 365;

const generateDate = () => {

  const maxDaysGap = DAYS_IN_YEAR * 10;
  const daysGap = getRandomInteger(0, maxDaysGap);

  return dayjs().add(-daysGap, 'day').toISOString();
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getArrayRandomLength = (initialArrayElements) =>
{
  const firstElement = getRandomInteger(0, initialArrayElements.length - 1);
  let secondElement = getRandomInteger(1, initialArrayElements.length);

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
  const newArray = new Array(getRandomInteger(lengthFrom, lengthTo)).fill().map(() =>
    getRandomArrayElement(initialArrayElements));

  return newArray;
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export {
  getRandomInteger,
  getRandomFloat,
  generateDate,
  getRandomArrayElement,
  getArrayRandomLength,
  getArraySpecifiedLength,
  createElement
};
