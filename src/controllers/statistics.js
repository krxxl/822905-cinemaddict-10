import StatisticsComponent from '../components/statistics.js';
import {render, RenderPosition} from '../utils/render.js';

export default class StatisticsController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;



  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();


    this._statisticsComponent = new StatisticsComponent(allCards);
    render(container, this._statisticsComponent.getElement(), RenderPosition.BEFOREEND);
    this._statisticsComponent.setPeriodChangeHandler(() => {});

  }

  hide() {
    this._statisticsComponent.hide()
  }

  show() {
    this._statisticsComponent.show()
  }



  // _onFilterChange(filterType) {
  //   this._cardsModel.setFilter(filterType);
  //   this._activeFilterType = filterType;
  // }

  // _onDataChange() {
  //   this.render();
  // }
}
