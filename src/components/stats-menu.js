import AbstractComponent from './abstract-component.js';

const activeClass = `main-navigation__item--active`;

const createStatsNavigationTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`
  );
};


export default class Stats extends AbstractComponent {

  getTemplate() {
    return createStatsNavigationTemplate();
  }

  setStatsChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (!this.getElement().classList.contains(activeClass)) {
        this.getElement().classList.add(activeClass);
        handler(`active`);
      } else {
        this.getElement().classList.remove(activeClass);
        handler(`no-active`);
      }
    });
  }
}
