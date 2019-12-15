import AbstractComponent from './abstract-component.js';

const createCardTemplate = (card) => {
  const {title, rating, date, duration, genres, poster, countComments, description, isInWatchlist, isWatched, isFavorite} = card;
  let classWatchlist = ``;
  let classWatched = ``;
  let classFavorite = ``;
  if (isInWatchlist) {
    classWatchlist = `film-card__controls-item--active`;
  }
  if (isWatched) {
    classWatched = `film-card__controls-item--active`;
  }
  if (isFavorite) {
    classFavorite = `film-card__controls-item--active`;
  }
  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date.getFullYear()}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${countComments} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${classWatchlist}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${classWatched}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${classFavorite}">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  setPopupOpenHadlerHandler(arr, handler) {
    arr.forEach((element) => {
      this.getElement().querySelector(element)
      .addEventListener(`click`, handler);
    });
  }

  setWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setMarkWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
