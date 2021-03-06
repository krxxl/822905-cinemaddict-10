import FilterComponent from '../components/menu.js';
import {FilterType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getCardsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, cardsModel, pageController, sorts, statisticsController) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._pageController = pageController;
    this._sorts = sorts;
    this._statisticsController = statisticsController;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getCardsByFilter(allCards, filterType).length,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    if (filterType) {
      this._pageController.show();
      this._sorts.show();
      this._statisticsController.hide();
      document.querySelector(`.main-navigation__item--additional`).classList.remove(`main-navigation__item--active`);
    }
  }

  _onDataChange() {
    this.render();
  }


}
