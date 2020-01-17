
import {FilterType} from '../const.js';


export const getWatchlistCards = (cards) => {
  return cards.filter((card) => card.isInWatchlist);
};

export const getHistotryCards = (cards) => {
  return cards.filter((card) => card.isWatched);
};

export const getFavoriteCards = (cards) => {
  return cards.filter((card) => card.isFavorite);
};


export const getCardsByFilter = (cards, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return cards;
    case FilterType.WATCHLIST:
      return getWatchlistCards(cards);
    case FilterType.HISTORY:
      return getHistotryCards(cards);
    case FilterType.FAVORITES:
      return getFavoriteCards(cards);
  }

  return cards;
};
