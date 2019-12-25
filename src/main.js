
import PageController from './controllers/page.js';
import ProfileComponent from './components/profile.js';
import CardListsComponent from './components/card-list.js';
// import SiteNavigationComponent from './components/menu.js';
import SiteSortComponent from './components/sort.js';
import {generateCards} from './mock/card.js';
import {filmsQuantity, getRank} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import CardsModel from './models/movies.js';
import FilterController from './controllers/filters.js';


const CARD_COUNT = 22;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);

// const filters = generateFilters();
// render(siteMainElement, new SiteNavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);

const cards = generateCards(CARD_COUNT);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();

const sorts = new SiteSortComponent();
render(siteMainElement, sorts.getElement(), RenderPosition.BEFOREEND);
const cardList = new CardListsComponent();
render(siteMainElement, cardList.getElement(), RenderPosition.BEFOREEND);

const statics = document.querySelector(`.footer__statistics>p`);
statics.textContent = `${CARD_COUNT} movies inside`;

const rank = document.querySelector(`.profile__rating`);
rank.textContent = `${getRank(filmsQuantity)}`;

const pageController = new PageController(cardList, sorts, cardsModel);

pageController.render();
