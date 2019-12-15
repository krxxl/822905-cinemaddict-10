import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {render, remove, RenderPosition} from '../utils/render.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(card) {

    const cardComponent = new CardComponent(card);
    const popupComponent = new PopupComponent(card);

    const siteFooterElement = document.querySelector(`.footer`);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        remove(popupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const openPopup = () => {
      render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTERBEGIN);
      document.addEventListener(`keydown`, (evt) => {
        onEscKeyDown(evt);
      });
    };

    cardComponent.setPopupOpenHadlerHandler([`.film-card__poster`, `.film-card__title`, `.film-card__comments`], () => {
      openPopup();
    });

    popupComponent.setClosePopupHandler(() => {
      remove(popupComponent);
    });

    render(this._container, cardComponent.getElement(), RenderPosition.BEFOREEND);

    let isInMainlist = false;

    cardComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const watchlist = document.querySelector(`#watchlist`).querySelector(`.main-navigation__item-count`);
      const watchlistVal = watchlist.innerText;
      if (!isInMainlist) {
        watchlist.innerText = +watchlistVal + 1;
        isInMainlist = true;
      } else {
        watchlist.innerText = +watchlistVal - 1;
        isInMainlist = false;
      }
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
      }));
    });

    let isWatched = false;

    cardComponent.setMarkWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const watched = document.querySelector(`#history`).querySelector(`.main-navigation__item-count`);
      const watchedVal = document.querySelector(`#history`).querySelector(`.main-navigation__item-count`).innerText;
      if (!isWatched) {
        watched.innerText = +watchedVal + 1;
        isWatched = true;
      } else {
        watched.innerText = +watchedVal - 1;
        isWatched = false;
      }
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    let isFavorite = false;
    cardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const favorites = document.querySelector(`#favorites`).querySelector(`.main-navigation__item-count`);
      const favoritesVal = document.querySelector(`#favorites`).querySelector(`.main-navigation__item-count`).innerText;
      if (!isFavorite) {
        favorites.innerText = +favoritesVal + 1;
        isFavorite = true;
      } else {
        favorites.innerText = +favoritesVal - 1;
        isFavorite = false;
      }
      // this._onDataChange(this, card, Object.assign({}, card, {
      //   isFavorite: !card.isFavorite,
      // }));
    });
  }
}