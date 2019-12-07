import AbstractComponent from './abstract-component.js';

const filterTemplate = (filter) => {
  const {name, count, shortname} = filter;

  if (name === `Stats`) {
    return `<a href="#${shortname}" class="main-navigation__item main-navigation__item--additional">${name}</a>`;
  } else {
    return `<a href="#${shortname}" class="main-navigation__item main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`;
  }
};

const createSiteNavigationTemplate = (filters) => {

  const filter = filters.map((it) => filterTemplate(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
    ${filter}
   </nav>
   <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
   `
  );
};


export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteNavigationTemplate(this._filters);
  }
}
