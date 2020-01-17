
import PageController from './controllers/page.js';
import ProfileComponent from './components/profile.js';
import CardListsComponent from './components/card-list.js';
import StatisticsComponent from './components/statistics.js';
import StatsMenuComponent from './components/stats-menu.js';
import SiteSortComponent from './components/sort.js';
// import {generateCards} from './mock/card.js';
import {getRank} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import CardsModel from './models/movies.js';
import FilterController from './controllers/filters.js';
import API from './api.js';


// const CARD_COUNT = 22;
const AUTHORIZATION = `Basic KJgykjbsdajfjasd=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const api = new API(END_POINT, AUTHORIZATION);

render(siteHeaderElement, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);


// const statisticsComponent = new StatisticsComponent();
// const filters = generateFilters();
// render(siteMainElement, new SiteNavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);

// const cards = generateCards(CARD_COUNT);
const cardsModel = new CardsModel();
// cardsModel.setCards(cards);

// const watchedCards = cards.filter((card) => card.isWatched);
// const watchedCardsCount = watchedCards.length;

// const dateTo = new Date();
// const dateFrom = (() => {
//   const d = new Date(dateTo);
//   d.setDate(d.getDate() - 7);
//   return d;
// })();

// const statisticsComponent = new StatisticsComponent(cardsModel);


const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();


const mainNav = siteMainElement.querySelector(`.main-navigation`);
const statsMenu = new StatsMenuComponent();
render(mainNav, statsMenu.getElement(), RenderPosition.BEFOREEND);


const sorts = new SiteSortComponent();
render(siteMainElement, sorts.getElement(), RenderPosition.BEFOREEND);
const cardList = new CardListsComponent();
render(siteMainElement, cardList.getElement(), RenderPosition.BEFOREEND);
// render(siteMainElement, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

// const statics = document.querySelector(`.footer__statistics>p`);
// statics.textContent = `${CARD_COUNT} movies inside`;

// const rank = document.querySelector(`.profile__rating`);
// rank.textContent = `${getRank(watchedCardsCount)}`;

const pageController = new PageController(cardList, sorts, cardsModel);

// statisticsComponent.hide();
// pageController.render();

// statisticsComponent.setPeriodChangeHandler(() => {
// });

statsMenu.setStatsChangeHandler((state) => {
  switch (state) {
    case `no-active`:
      // statisticsComponent.hide();
      pageController.show();
      break;
    case `active`:
      // statisticsComponent.show();
      pageController.hide();
      break;
  }
});

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    pageController.render();
  });
