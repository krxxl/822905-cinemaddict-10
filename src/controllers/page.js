import MainListComponent from '../components/main-list.js';
import TopRatedComponent from '../components/top-rated.js';
import NoListComponent from '../components/no-cards.js';
import MostCommentedComponent from '../components/most-commented.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const renderCard = (container, card) => {
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

  render(container, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noListComponent = new NoListComponent();
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._cardComponent = new CardComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(cards) {
    const container = this._container.getElement();

    const getSortByRating = (arr) => {
      return arr.sort((a, b) => +a.rating > +b.rating ? -1 : 1);
    };

    const getSortByComments = (arr) => {
      return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
    };

    const SHOWING_CARDS_COUNT_ON_START = 5;
    const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

    if (cards.length === 0) {
      render(container, new NoListComponent().getElement(), RenderPosition.BEFOREEND);
    } else {

      const mainList = new MainListComponent();
      render(container, mainList.getElement(), RenderPosition.BEFOREEND);

      const siteFilmListContainerElement = mainList.getElement().querySelector(`.films-list__container`);

      const showMoreButton = new ShowMoreButtonComponent();
      render(mainList.getElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);

      let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
      cards.slice(0, showingCardsCount)
      .forEach((card) => renderCard(siteFilmListContainerElement, card));


      let countOfAllRating = 0;
      let countOfAllComment = 0;

      cards.forEach((card) => {
        countOfAllRating += +card.rating;
        countOfAllComment += +card.countComments;
      });

      const sortByRating = getSortByRating(cards.slice());
      const sortByComments = getSortByComments(cards.slice());

      const topRated = new TopRatedComponent();
      if (countOfAllRating > 0) {
        render(container, topRated.getElement(), RenderPosition.BEFOREEND);
      }

      const siteTopRatedElements = topRated.getElement().querySelector(`#top-rated .films-list__container`);
      sortByRating.slice(0, 2)
      .forEach((card) => renderCard(siteTopRatedElements, card));

      const mostCommented = new MostCommentedComponent();
      if (countOfAllComment > 0) {
        render(container, mostCommented.getElement(), RenderPosition.BEFOREEND);
      }

      const siteMostCommentsElements = mostCommented.getElement().querySelector(`#most-commented .films-list__container`);
      sortByComments.slice(0, 2)
      .forEach((card) => renderCard(siteMostCommentsElements, card));

      showMoreButton.setShowMoreCardsHandler(() => {
        const prevCardsCount = showingCardsCount;
        showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

        cards.slice(prevCardsCount, showingCardsCount)
          .forEach((card) => renderCard(siteFilmListContainerElement, card));

        if (showingCardsCount >= cards.length) {
          remove(showMoreButton);
        }
      });
    }
  }
}
