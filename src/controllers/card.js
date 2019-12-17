import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._cardComponent = null;
    this._popupComponent = null;
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardComponent(card);
    this._popupComponent = new PopupComponent(card);

    const siteFooterElement = document.querySelector(`.footer`);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        remove(this._popupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const openPopup = () => {
      render(siteFooterElement, this._popupComponent.getElement(), RenderPosition.AFTERBEGIN);
      document.addEventListener(`keydown`, (evt) => {
        onEscKeyDown(evt);
      });
    };

    this._cardComponent.setPopupOpenHadlerHandler([`.film-card__poster`, `.film-card__title`, `.film-card__comments`], () => {
      openPopup();
    });

    this._popupComponent.setClosePopupHandler(() => {
      remove(this._popupComponent);
    });

    // render(this._container, this._cardComponent.getElement(), RenderPosition.BEFOREEND);


    this._cardComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const watchlist = document.querySelector(`#watchlist`).querySelector(`.main-navigation__item-count`);
      const watchlistVal = watchlist.innerText;
      if (!card.isInWatchlist) {
        watchlist.innerText = +watchlistVal + 1;
      } else {
        watchlist.innerText = +watchlistVal - 1;
      }
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
      }));
    });

    this._cardComponent.setMarkWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const watched = document.querySelector(`#history`).querySelector(`.main-navigation__item-count`);
      const watchedVal = document.querySelector(`#history`).querySelector(`.main-navigation__item-count`).innerText;
      if (!card.isWatched) {
        watched.innerText = +watchedVal + 1;
      } else {
        watched.innerText = +watchedVal - 1;
      }
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });

    this._cardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const favorites = document.querySelector(`#favorites`).querySelector(`.main-navigation__item-count`);
      const favoritesVal = document.querySelector(`#favorites`).querySelector(`.main-navigation__item-count`).innerText;
      if (!card.isFavorite) {
        favorites.innerText = +favoritesVal + 1;
      } else {
        favorites.innerText = +favoritesVal - 1;
      }
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);

    } else {

      render(this._container, this._cardComponent.getElement(), RenderPosition.BEFOREEND);
    }

  }
}
