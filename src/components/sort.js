import AbstractComponent from './abstract-component.js';

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};

const addClassActive = (curSort) => {
  const sorts = document.querySelectorAll(`.sort__button`);
  sorts.forEach((sort) => {
    sort.classList.remove(`sort__button--active`);
  });
  curSort.classList.add(`sort__button--active`);
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}"class="sort__button">Sort by rating</a></li>
    </ul>
   `
  );
};


export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._filters);
  }

  setSortingTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      addClassActive(evt.target);

      if (this._currenSortType === sortType) {
        return;
      }


      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
