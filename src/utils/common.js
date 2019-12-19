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

