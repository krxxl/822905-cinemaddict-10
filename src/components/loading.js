import AbstractComponent from './abstract-component.js';

const createLoadingTemplate = () => {
  return (
    `<h2 class="loading">LOADING</section>`
  );
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
