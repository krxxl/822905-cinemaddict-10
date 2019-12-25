import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardComponent = null;
    this._popupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardComponent(card);
    this._popupComponent = new PopupComponent(card);

    this._cardComponent.setPopupOpenHadlerHandler([`.film-card__poster`, `.film-card__title`, `.film-card__comments`], () => {
      this._openPopup();
    });

    this._popupComponent.setClosePopupHandler(() => {
      this._closePopup();
    });

    const onWatchList = (evt) => {
      evt.preventDefault();
      // const watchlist = document.querySelector(`#filter__watchlist`).querySelector(`.main-navigation__item-count`);
      // const watchlistVal = watchlist.innerText;
      // if (!card.isInWatchlist) {
      //   watchlist.innerText = +watchlistVal + 1;
      // } else {
      //   watchlist.innerText = +watchlistVal - 1;
      // }
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
      }));
    };

    const onWatched = (evt) => {
      evt.preventDefault();
      // const watched = document.querySelector(`#filter__history`).querySelector(`.main-navigation__item-count`);
      // const watchedVal = watched.innerText;
      // if (!card.isWatched) {
      //   watched.innerText = +watchedVal + 1;
      // } else {
      //   watched.innerText = +watchedVal - 1;
      // }
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    };

    const onFavorite = (evt) => {
      evt.preventDefault();
      // const favorites = document.querySelector(`#filter__favorites`).querySelector(`.main-navigation__item-count`);
      // const favoritesVal = favorites.innerText;
      // if (!card.isFavorite) {
      //   favorites.innerText = +favoritesVal + 1;
      // } else {
      //   favorites.innerText = +favoritesVal - 1;
      // }
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    };

    this._cardComponent.setWatchListButtonClickHandler((evt) => {
      onWatchList(evt);
    });

    this._popupComponent.setWatchListButtonClickHandler((evt) => {
      onWatchList(evt);
    });

    this._popupComponent.setMarkWatchedButtonClickHandler((evt) => {
      onWatched(evt);
    });

    this._cardComponent.setMarkWatchedButtonClickHandler((evt) => {
      onWatched(evt);
    });

    this._popupComponent.setFavoriteButtonClickHandler((evt) => {
      onFavorite(evt);
    });

    this._cardComponent.setFavoriteButtonClickHandler((evt) => {
      onFavorite(evt);
    });

    this._popupComponent.setCloseButtonClickHandler((evt, index) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        countComments: card.countComments - 1,
        comments: [].concat(card.comments.slice(0, index), card.comments.slice(index + 1)),
      }));
    });

    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);

    } else {

      render(this._container, this._cardComponent.getElement(), RenderPosition.BEFOREEND);
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    this._onViewChange();
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._popupComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._mode = Mode.POPUP;
    document.addEventListener(`keydown`, (evt) => {
      this._onEscKeyDown(evt);
    });
  }

  _closePopup() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
