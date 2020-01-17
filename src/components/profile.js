import AbstractComponent from './abstract-component.js';
import {getRank} from '../mock/filter.js';

const getWatchedCards = (cards) => {
  return cards.filter((card) => card.isWatched);
}


const createProfileTemplate = (cards) => {
  const watchedCardsCount = cards.length;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRank(watchedCardsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class Profile extends AbstractComponent {

  constructor(cards) {
    super();
    this._cards = cards.getCards();
  }

  getTemplate() {
    console.log(this._cards)
    return createProfileTemplate(getWatchedCards(this._cards));
  }
}
