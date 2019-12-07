import AbstractComponent from './abstract-component.js';

const createCardListsTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class CardList extends AbstractComponent {
  getTemplate() {
    return createCardListsTemplate();
  }
}
