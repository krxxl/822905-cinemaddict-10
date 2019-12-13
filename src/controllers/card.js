import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {render, remove, RenderPosition} from '../utils/render.js';

export default class MovieController {
  constructor(container) {
    this._container = container;
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
  };

}
