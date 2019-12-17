import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.nextElementSibling ;
    console.log(oldElement);
    this.removeElement();

    const newElement = this.getElement();
    console.log(newElement);
    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
