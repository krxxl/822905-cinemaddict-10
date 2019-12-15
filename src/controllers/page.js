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


const renderCards = (container, cards, onDataChange) => {
  return cards.forEach((card) => {
    const movieController = new MovieController(container, onDataChange);
    movieController.render(card);

    return movieController;
  });
};

export default class PageController {
  constructor(container, sorts) {
    this._container = container;
    this._sortComponent = sorts;
    this._noListComponent = new NoListComponent();
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mainListComponent = new MainListComponent();

    this._cards = [];

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(cards) {

    this._cards = cards;
    const renderLoadMoreButton = () => {
      if (showingCardsCount >= cards.length) {
        return;
      }

      render(mainList.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setShowMoreCardsHandler(() => {
        const prevCardsCount = showingCardsCount;
        showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

        renderCards(siteFilmListContainerElement, cards.slice(prevCardsCount, showingCardsCount), this._onDataChange);

        if (showingCardsCount >= cards.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();

    const getSortByRating = (arr) => {
      return arr.sort((a, b) => +a.rating > +b.rating ? -1 : 1);
    };

    const getSortByComments = (arr) => {
      return arr.sort((a, b) => a.countComments > b.countComments ? -1 : 1);
    };

    if (cards.length === 0) {
      render(container, this._noListComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    const mainList = this._mainListComponent;
    render(container, mainList.getElement(), RenderPosition.BEFOREEND);

    const siteFilmListContainerElement = mainList.getElement().querySelector(`.films-list__container`);

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    renderCards(siteFilmListContainerElement, cards.slice(0, showingCardsCount), this._onDataChange,);
    renderLoadMoreButton();


    let countOfAllRating = 0;
    let countOfAllComment = 0;

    cards.forEach((card) => {
      countOfAllRating += +card.rating;
      countOfAllComment += +card.countComments;
    });

    const sortByRating = getSortByRating(cards.slice());
    const sortByComments = getSortByComments(cards.slice());

    const topRated = this._topRatedComponent;
    if (countOfAllRating > 0) {
      render(container, topRated.getElement(), RenderPosition.BEFOREEND);
    }

    const siteTopRatedElements = topRated.getElement().querySelector(`#top-rated .films-list__container`);
    renderCards(siteTopRatedElements, sortByRating.slice(0, 2), this._onDataChange,);

    const mostCommented = this._mostCommentedComponent;
    if (countOfAllComment > 0) {
      render(container, mostCommented.getElement(), RenderPosition.BEFOREEND);
    }

    const siteMostCommentsElements = mostCommented.getElement().querySelector(`#most-commented .films-list__container`);
    renderCards(siteMostCommentsElements, sortByComments.slice(0, 2), this._onDataChange,);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case SortType.RATING:
          sortedCards = sortByRating;
          break;
        case SortType.DATE:
          sortedCards = cards.sort((a, b) => a.date > b.date ? -1 : 1);
          break;
        case SortType.DEFAULT:
          sortedCards = cards.slice(0, showingCardsCount);
          break;
      }

      siteFilmListContainerElement.innerHTML = ``;

      renderCards(siteFilmListContainerElement, sortedCards);

      if (sortType === sortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        remove(this._showMoreButtonComponent);
      }
    });

  }

  _onDataChange(CardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }
    console.log(oldData);
    console.log(newData);
    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    CardController.render(this._cards[index]);
  }
}
