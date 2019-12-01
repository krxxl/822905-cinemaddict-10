import {createProfileTemplate} from './components/profile.js';
import {createCardListsTemplate} from './components/card-list.js';
import {createMainListTemplate} from './components/main-list.js';
import {createTopRatedTemplate} from './components/top-rated.js';
import {createMostCommentedTemplate} from './components/most-commented.js';
import {createSiteNavigationTemplate, createSiteSortTemplate} from './components/menu.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createCardTemplate} from './components/card.js';
import {createPopupTemplate} from './components/popup.js';
import {generateCard, generateCards} from './mock/card.js';
import {generateFilters, filmsQuantity, getRank} from './mock/filter.js';

const CARD_COUNT = 22;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const getSortByRaiting = (arr) => {
  return arr.sort((a, b) => a.raiting > b.raiting ? -1 : 1);
};

const getSortByComments = (arr) => {
  return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
};


const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteNavigationTemplate(generateFilters()), `beforeend`);
render(siteMainElement, createSiteSortTemplate(), `beforeend`);
render(siteMainElement, createCardListsTemplate(), `beforeend`);

const siteFilmListElement = siteMainElement.querySelector(`.films`);
render(siteFilmListElement, createMainListTemplate(), `beforeend`);


const siteMainListElement = siteMainElement.querySelector(`.films-list`);
const siteFilmListContainerElement = siteMainListElement.querySelector(`.films-list__container`);
render(siteMainListElement, createShowMoreButtonTemplate(), `beforeend`);

const cards = generateCards(CARD_COUNT);

let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
cards.slice(0, showingCardsCount).forEach((card) => render(siteFilmListContainerElement, createCardTemplate(card), `beforeend`));

let countOfAllRaiting = 0;
let countOfAllComment = 0;

cards.forEach((card) => {
  countOfAllRaiting += +card.raiting;
  countOfAllComment += +card.countComments;
});

const sortByRaiting = getSortByRaiting(cards);
const sortByComments = getSortByComments(cards);


if (countOfAllRaiting > 0) {
  render(siteFilmListElement, createTopRatedTemplate(), `beforeend`);
}

const siteTopRatedElements = siteFilmListElement.querySelector(`#top-rated .films-list__container`);
sortByRaiting.slice(0, 2).forEach((card) => render(siteTopRatedElements, createCardTemplate(card), `beforeend`));

if (countOfAllComment > 0) {
  render(siteFilmListElement, createMostCommentedTemplate(), `beforeend`);
}

const siteMostCommentsElements = siteFilmListElement.querySelector(`#most-commented .films-list__container`);
sortByComments.slice(0, 2).forEach((card) => render(siteMostCommentsElements, createCardTemplate(card), `beforeend`));

const popupInfo = generateCard;
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createPopupTemplate(popupInfo()), `afterend`);

const statics = document.querySelector(`.footer__statistics>p`);
statics.innerHTML = `${CARD_COUNT} movies inside`;

const rank = document.querySelector(`.profile__rating`);
rank.innerHTML = `${getRank(filmsQuantity)}`;

const loadMoreButton = siteMainListElement.querySelector(`.films-list__show-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevCardsCount = showingCardsCount;
  showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardsCount, showingCardsCount)
    .forEach((card) => render(siteFilmListContainerElement, createCardTemplate(card), `beforeend`));

  if (showingCardsCount >= cards.length) {
    loadMoreButton.remove();
  }
});
