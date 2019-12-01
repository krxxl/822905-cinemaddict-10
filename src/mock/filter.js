import {getRandomIntegerNumber} from '../utils.js';

const filterNames = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
  `Stats`
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10),
      shortname: it.split(` `)[0].toLowerCase()
    };
  });
};

const filmsQuantity = getRandomIntegerNumber(0, 30);

const getRank = (quantity) => {
  if (quantity === 0) {
    return null;
  } else if (quantity >= 1 && quantity <= 10) {
    return `novice`;
  } else if (quantity >= 11 && quantity <= 20) {
    return `fan`;
  }
  return `movie buff`;
};

export {generateFilters, filmsQuantity, getRank};
