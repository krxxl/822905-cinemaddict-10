import {createElement} from '../utils.js';

const createCardListsTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class CardList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardListsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
