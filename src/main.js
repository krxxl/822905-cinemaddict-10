import ProfileComponent from './components/profile.js';
import CardListsComponent from './components/card-list.js';
import MainListComponent from './components/main-list.js';
import TopRatedComponent from './components/top-rated.js';
import MostCommentedComponent from './components/most-commented.js';
import SiteNavigationComponent from './components/menu.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import CardComponent from './components/card.js';
import PopupComponent from './components/popup.js';
import {generateCard, generateCards} from './mock/card.js';
import {generateFilters, filmsQuantity, getRank} from './mock/filter.js';
import {render, RenderPosition} from './utils.js';

const CARD_COUNT = 22;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;


const renderCard = (container, card) => {
  const cardComponent = new CardComponent(card);
  const popupComponent = new PopupComponent(card);

  const cardPoster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitle = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardComment = cardComponent.getElement().querySelector(`.film-card__comments`);
  const siteFooterElement = document.querySelector(`.footer`);

  const openPopup = () => {
    render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTERBEGIN);
  };

  [cardPoster, cardTitle, cardComment].forEach((target) => target.addEventListener(`click`, () => {
    openPopup();
  }));

  const closeButtonPopup = popupComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButtonPopup.addEventListener(`click`, () => {
    popupComponent.getElement().remove();
  });

  render(container, cardComponent.getElement(), RenderPosition.BEFOREEND);
};


const getSortByRaiting = (arr) => {
  return arr.sort((a, b) => a.raiting > b.raiting ? -1 : 1);
};

const getSortByComments = (arr) => {
  return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
};


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new SiteNavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);

const cardList = new CardListsComponent();
render(siteMainElement, cardList.getElement(), RenderPosition.BEFOREEND);

const mainList = new MainListComponent();

const siteFilmListElement = siteMainElement.querySelector(`.films`);

render(siteFilmListElement, mainList.getElement(), RenderPosition.BEFOREEND);

const siteMainListElement = siteMainElement.querySelector(`.films-list`);
const siteFilmListContainerElement = siteMainListElement.querySelector(`.films-list__container`);

const showMoreButton = new ShowMoreButtonComponent()
render(siteFilmListElement, showMoreButton.getElement(), RenderPosition.BEFOREEND);

const cards = generateCards(CARD_COUNT);

let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
cards.slice(0, showingCardsCount)
.forEach((card) => renderCard(siteFilmListContainerElement, card));
// render(siteFilmListContainerElement, new CardComponent(card).getElement(), RenderPosition.BEFOREEND)


let countOfAllRaiting = 0;
let countOfAllComment = 0;

cards.forEach((card) => {
  countOfAllRaiting += +card.raiting;
  countOfAllComment += +card.countComments;
});

const sortByRaiting = getSortByRaiting(cards);
const sortByComments = getSortByComments(cards);

const topRated = new TopRatedComponent();
if (countOfAllRaiting > 0) {
  render(siteFilmListElement, topRated.getElement(), RenderPosition.BEFOREEND);
}

const siteTopRatedElements = topRated.getElement().querySelector(`#top-rated .films-list__container`);
sortByRaiting.slice(0, 2)
.forEach((card) => renderCard(siteTopRatedElements, card));

const mostCommented = new MostCommentedComponent();
if (countOfAllComment > 0) {
  render(siteFilmListElement, mostCommented.getElement(), RenderPosition.BEFOREEND);
}

const siteMostCommentsElements = siteFilmListElement.querySelector(`#most-commented .films-list__container`);
sortByComments.slice(0, 2)
.forEach((card) => renderCard(siteMostCommentsElements, card));


const statics = document.querySelector(`.footer__statistics>p`);
statics.textContent = `${CARD_COUNT} movies inside`;

const rank = document.querySelector(`.profile__rating`);
rank.textContent = `${getRank(filmsQuantity)}`;

showMoreButton.getElement().addEventListener(`click`, () => {
  const prevCardsCount = showingCardsCount;
  showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardsCount, showingCardsCount)
    .forEach((card) => render(siteFilmListContainerElement, new CardComponent(card).getElement(), RenderPosition.BEFOREEND));

  if (showingCardsCount >= cards.length) {
    showMoreButton.getElement().remove();
    showMoreButton.removeElement();
  }
});
