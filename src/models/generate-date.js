import dayjs from 'dayjs';
import {returnRandomNumber} from './return-random-number.js';

const DAYS_IN_YEAR = 365;

export const generateDate = () => {

  const maxDaysGap = DAYS_IN_YEAR * 10;
  const daysGap = returnRandomNumber(0, maxDaysGap);

  return dayjs().add(-daysGap, 'day');
};
