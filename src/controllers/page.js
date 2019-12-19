import MainListComponent from '../components/main-list.js';
import TopRatedComponent from '../components/top-rated.js';
import NoListComponent from '../components/no-cards.js';
import MostCommentedComponent from '../components/most-commented.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../components/sort.js';
import MovieController from './card.js';

const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;


const renderCards = (container, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(card);

    return movieController;
  });
};

export default class PageController {
  constructor(container, sorts) {
    this._container = container;
    this._sortComponent = sorts;
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._noListComponent = new NoListComponent();
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mainListComponent = new MainListComponent();

    this._cards = [];
    this._showedCardsControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._siteFilmListContainerElement = this._mainListComponent.getElement().querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {

    this._cards = cards;

    const container = this._container.getElement();


    if (cards.length === 0) {
      render(container, this._noListComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    const mainList = this._mainListComponent;
    render(container, mainList.getElement(), RenderPosition.BEFOREEND);

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    const newCards = renderCards(this._siteFilmListContainerElement, cards.slice(0, showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);
    this._renderLoadMoreButton();

    this._renderTopRated();
    this._renderMostComments();

  }

  _renderTopRated() {
    let countOfAllRating = 0;

    const getSortByRating = (arr) => {
      return arr.sort((a, b) => +a.rating > +b.rating ? -1 : 1);
    };

    this._cards.forEach((card) => {
      countOfAllRating += +card.rating;
    });

    const sortByRating = getSortByRating(this._cards.slice());

    const topRated = this._topRatedComponent;
    if (countOfAllRating > 0) {
      render(this._container.getElement(), topRated.getElement(), RenderPosition.BEFOREEND);
    }

    const siteTopRatedElements = topRated.getElement().querySelector(`#top-rated .films-list__container`);

    const newCards = renderCards(siteTopRatedElements, sortByRating.slice(0, 2), this._onDataChange, this._onViewChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);
  }

  _renderMostComments() {
    let countOfAllComment = 0;

    this._cards.forEach((card) => {
      countOfAllComment += +card.countComments;
    });

    const getSortByComments = (arr) => {
      return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
    };

    const sortByComments = getSortByComments(this._cards.slice());

    const mostCommented = this._mostCommentedComponent;
    if (countOfAllComment > 0) {
      render(this._container.getElement(), mostCommented.getElement(), RenderPosition.BEFOREEND);
    }

    const siteMostCommentsElements = mostCommented.getElement().querySelector(`#most-commented .films-list__container`);

    const newCards = renderCards(siteMostCommentsElements, sortByComments.slice(0, 2), this._onDataChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);

  }

  _renderLoadMoreButton() {
    if (this._showingCardsCount >= this._cards.length) {
      return;
    }

    render(this._mainListComponent.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreCardsHandler(() => {
      const prevCardsCount = this._showingCardsCount;
      this._showingCardsCount = this._showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

      const newCards = renderCards(this._siteFilmListContainerElement, this._cards.slice(prevCardsCount, this._showingCardsCount), this._onDataChange, this._onViewChange);
      this._showedCardsControllers = this._showedCardsControllers.concat(newCards);

      if (this._showingCardsCount >= this._cards.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];

    switch (sortType) {
      case SortType.RATING:
        sortedCards = this._cards.slice().sort((a, b) => +a.rating > +b.rating ? -1 : 1);
        break;
      case SortType.DATE:
        sortedCards = this._cards.slice().sort((a, b) => a.date > b.date ? -1 : 1);
        break;
      case SortType.DEFAULT:
        sortedCards = this._cards.slice(0, this._showingCardsCount);
        break;
    }

    this._siteFilmListContainerElement.innerHTML = ``;

    const newCards = renderCards(this._siteFilmListContainerElement, sortedCards, this._onDataChange, this._onViewChange);
    this._showedCardsControllers = newCards;

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(CardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    CardController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardsControllers.forEach((it) => it.setDefaultView());
  }
}
