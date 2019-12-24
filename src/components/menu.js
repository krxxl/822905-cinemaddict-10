import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const filterTemplate = (filter) => {
  // const {name, count, shortname} = filter;

  // if (name === `Stats`) {
  //   return `<a href="#${shortname}" class="main-navigation__item main-navigation__item--additional">${name}</a>`;
  // } else {
  //   return `<a href="#${shortname}" id="filter__${shortname}" class="main-navigation__item main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`;
  // }
  const {name, count} = filter;

  if (name === `Stats`) {
    return `<a href="#${name}" class="main-navigation__item main-navigation__item--additional">${name}</a>`;
  } else {
    return `<a href="#${name}" id="filter__${name}" class="main-navigation__item main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`;
  }
};

const createSiteNavigationTemplate = (filters) => {

  const filter = filters.map((it) => filterTemplate(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
    ${filter}
   </nav>
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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const filterName = getFilterNameById(evt.target.id);
      console.log(evt.target.id);
      handler(filterName);
    });
  }
}
