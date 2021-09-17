export const getRandomInteger = (firstNumber, secondNumber) => {
  if (firstNumber < 0 || secondNumber < 0) {
    return NaN;
  }

  if (firstNumber > secondNumber) {
    return NaN;
  }

  return Math.round(Math.random() * (secondNumber - firstNumber) + firstNumber);
};

export const getRandomFloat = (firstNumber, secondNumber, numberOfSings = 0) => {
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

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export const getArrayRandomLength = (initialArrayElements) =>
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

export const getArraySpecifiedLength = (initialArrayElements, lengthFrom, lengthTo) =>
{
  const newArray = new Array(getRandomInteger(lengthFrom, lengthTo)).fill().map(() =>
    getRandomArrayElement(initialArrayElements));

  return newArray;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
