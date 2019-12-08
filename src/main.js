import ProfileComponent from './components/profile.js';
import CardListsComponent from './components/card-list.js';
import MainListComponent from './components/main-list.js';
import TopRatedComponent from './components/top-rated.js';
import NoListComponent from './components/no-cards.js';
import MostCommentedComponent from './components/most-commented.js';
import SiteNavigationComponent from './components/menu.js';
import SiteSortComponent from './components/sort.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import CardComponent from './components/card.js';
import PopupComponent from './components/popup.js';
import {generateCards} from './mock/card.js';
import {generateFilters, filmsQuantity, getRank} from './mock/filter.js';
import {render, remove, RenderPosition} from './utils/render.js';

const CARD_COUNT = 22;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;


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

  // const closeButtonPopup = popupComponent.getElement().querySelector(`.film-details__close-btn`);
  // closeButtonPopup.addEventListener(`click`, () => {
  //   remove(popupComponent);
  // });
  popupComponent.setClosePopupHandler(() => {
    remove(popupComponent);
  });

  render(container, cardComponent.getElement(), RenderPosition.BEFOREEND);
};


const getSortByRating = (arr) => {
  return arr.sort((a, b) => +a.rating > +b.rating ? -1 : 1);
};

const getSortByComments = (arr) => {
  return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
};


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new SiteNavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteSortComponent().getElement(), RenderPosition.BEFOREEND);

const cardList = new CardListsComponent();
render(siteMainElement, cardList.getElement(), RenderPosition.BEFOREEND);

const mainList = new MainListComponent();

const siteFilmListElement = siteMainElement.querySelector(`.films`);
const cards = generateCards(CARD_COUNT);

if (cards.length === 0) {
  render(siteFilmListElement, new NoListComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(siteFilmListElement, mainList.getElement(), RenderPosition.BEFOREEND);

  const siteMainListElement = siteMainElement.querySelector(`.films-list`);
  const siteFilmListContainerElement = siteMainListElement.querySelector(`.films-list__container`);

  const showMoreButton = new ShowMoreButtonComponent();
  render(siteFilmListElement, showMoreButton.getElement(), RenderPosition.BEFOREEND);

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
    render(siteFilmListElement, topRated.getElement(), RenderPosition.BEFOREEND);
  }

  const siteTopRatedElements = topRated.getElement().querySelector(`#top-rated .films-list__container`);
  sortByRating.slice(0, 2)
  .forEach((card) => renderCard(siteTopRatedElements, card));

  const mostCommented = new MostCommentedComponent();
  if (countOfAllComment > 0) {
    render(siteFilmListElement, mostCommented.getElement(), RenderPosition.BEFOREEND);
  }

  const siteMostCommentsElements = siteFilmListElement.querySelector(`#most-commented .films-list__container`);
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


const statics = document.querySelector(`.footer__statistics>p`);
statics.textContent = `${CARD_COUNT} movies inside`;

const rank = document.querySelector(`.profile__rating`);
rank.textContent = `${getRank(filmsQuantity)}`;


