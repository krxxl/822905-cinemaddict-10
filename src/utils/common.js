import moment from 'moment';

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
  let hours = randomTime / 60 ^ 0;
  if (hours) {
    let min = randomTime % 60;
    if (min < 10) {
      min = `0 ${min}`;
    }
    randomTime = `${hours}h ${min}m`;
  } else {
    randomTime = `${randomTime}m`;
  }
  return randomTime;
};

export const getRank = (quantity) => {
  if (quantity === 0) {
    return null;
  } else if (quantity >= 1 && quantity <= 10) {
    return `novice`;
  } else if (quantity >= 11 && quantity <= 20) {
    return `fan`;
  }
  return `movie buff`;
};
