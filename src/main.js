
import PageController from './controllers/page.js';
import ProfileComponent from './components/profile.js';
import CardListsComponent from './components/card-list.js';
import StatsMenuComponent from './components/stats-menu.js';
import LoadingComponent from './components/loading.js';
import SiteSortComponent from './components/sort.js';
import {render, RenderPosition} from './utils/render.js';
import CardsModel from './models/movies.js';
import FilterController from './controllers/filters.js';
import StatisticsController from './controllers/statistics.js';
import API from './api.js';
import {StatsState} from './components/stats-menu.js';

const AUTHORIZATION = `Basic KJgykjbsdajfjasd=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const loadingComponent = new LoadingComponent();
const api = new API(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();

const cardList = new CardListsComponent();
const statsMenu = new StatsMenuComponent();
const sorts = new SiteSortComponent();
const pageController = new PageController(cardList, sorts, cardsModel, api);

const profileComponent = new ProfileComponent(cardsModel);
const statisticsController = new StatisticsController(siteMainElement, cardsModel);
const filterController = new FilterController(siteMainElement, cardsModel, pageController, sorts, statisticsController);

statsMenu.setStatButtonChangeHandler((state) => {
  switch (state) {
    case StatsState.NO_ACTIVE:
      statisticsController.hide();
      pageController.show();
      sorts.show();
      break;
    case StatsState.ACTIVE:
      statisticsController.show();
      pageController.hide();
      sorts.hide();
      break;
  }
});


render(siteMainElement, loadingComponent.getElement(), RenderPosition.BEFOREEND);
api.getCards()
  .then((cards) => {
    loadingComponent.getElement().remove();
    cardsModel.setCards(cards);
    pageController.render();
    filterController.render();

    render(siteHeaderElement, profileComponent.getElement(), RenderPosition.BEFOREEND);
    const mainNav = siteMainElement.querySelector(`.main-navigation`);

    render(mainNav, statsMenu.getElement(), RenderPosition.BEFOREEND);

    render(siteMainElement, sorts.getElement(), RenderPosition.BEFOREEND);

    render(siteMainElement, cardList.getElement(), RenderPosition.BEFOREEND);

    const statics = document.querySelector(`.footer__statistics>p`);
    statics.textContent = `${cards.length} movies inside`;

    statisticsController.render();

    statisticsController.hide();
  });
