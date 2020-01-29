import AbstractComponent from './abstract-component.js';

const activeClass = `main-navigation__item--active`;

export const StatsState = {
  ACTIVE: `active`,
  NO_ACTIVE: `no-active`,
};

const createStatsNavigationTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`
  );
};


export default class Stats extends AbstractComponent {

  getTemplate() {
    return createStatsNavigationTemplate();
  }

  setStatButtonChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (!this.getElement().classList.contains(activeClass)) {
        this.getElement().classList.add(activeClass);
        handler(StatsState.ACTIVE);
      } else {
        this.getElement().classList.remove(activeClass);
        handler(StatsState.NO_ACTIVE);
      }
    });
  }
}
