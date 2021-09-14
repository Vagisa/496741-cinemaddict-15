import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';

const DAYS_IN_YEAR = 365;

export const generateDate = () => {

  const maxDaysGap = DAYS_IN_YEAR * 10;
  const daysGap = getRandomInteger(0, maxDaysGap);

  return dayjs().add(-daysGap, 'day').toISOString();
};

export const setToggleButton = (buttonClass) => {
  const buttonElement = document.querySelectorAll(`.${buttonClass}`);
  buttonElement.forEach((element) => {
    element.addEventListener('click', () => {
      buttonElement.forEach((item) => {
        item.classList.remove(`${buttonClass}--active`);
      });
      element.classList.add(`${buttonClass}--active`);
    });
  });
};
