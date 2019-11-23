const CARD_COUNT = 5;

import {createProfileTemplate} from './components/profile.js';
import {createCardListsTemplate} from './components/card-list.js';
import {createSiteMenuTemplate} from './components/menu.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createCardTemplate} from './components/card.js';
import {createPopupTemplate} from './components/popup.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createCardListsTemplate(), `beforeend`);

const siteFilmListElement = siteMainElement.querySelector(`.films-list`);
const siteFilmListContainerElement = siteFilmListElement.querySelector(`.films-list__container`);

render(siteFilmListElement, createShowMoreButtonTemplate(), `beforeend`);

new Array(CARD_COUNT).fill(``).forEach(
    () => render(siteFilmListContainerElement, createCardTemplate(), `beforeend`)
);

const siteFilmListExtraContainerElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

siteFilmListExtraContainerElements.forEach(
    (siteFilmListExtraContainerElement) => render(siteFilmListExtraContainerElement, createCardTemplate(), `beforeend`)
);

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createPopupTemplate(), `afterend`);
