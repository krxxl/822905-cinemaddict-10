import moment from 'moment';

const Rank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`,
};

export const formatDateWithMonths = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYearOnly = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};


export const getDuration = (randomTime) => {
  const hours = randomTime / 60 ^ 0;
  if (!hours) {
    return `${randomTime}m`;
  }
  const min = randomTime % 60;
  const minutes = min < 10 ? `0${min}` : min;
  return `${hours}h ${minutes}m`;
};

export const getRank = (quantity) => {
  if (quantity === 0) {
    return null;
  } else if (quantity >= 1 && quantity <= 10) {
    return Rank.NOVICE;
  } else if (quantity >= 11 && quantity <= 20) {
    return Rank.FAN;
  }
  return Rank.MOVIE_BUFF;
};
