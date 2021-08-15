const returnRandomNumber = function (firstNumber, secondNumber) {
  if (firstNumber < 0 || secondNumber < 0) {
    return NaN;
  }

  if (firstNumber > secondNumber) {
    return NaN;
  }

  return Math.round(Math.random() * (secondNumber - firstNumber) + firstNumber);
};

const returnRandomFloat = function (firstNumber, secondNumber, numberOfSings = 0) {
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

export {returnRandomNumber, returnRandomFloat};
