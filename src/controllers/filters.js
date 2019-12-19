import FilterComponent from '../components/filter.js';
import {FilterType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getCardsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getCardsByFilter(allCards, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
