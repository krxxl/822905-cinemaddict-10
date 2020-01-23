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
  constructor(container, sorts, cardsModel, api) {
    this._container = container;
    this._sortComponent = sorts;
    this._cardsModel = cardsModel;
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._noListComponent = new NoListComponent();
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mainListComponent = new MainListComponent();
    this._api = api;

    this._showedCardsControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._siteFilmListContainerElement = this._mainListComponent.getElement().querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {


    const container = this._container.getElement();
    const cards = this._cardsModel.getCards();


    if (cards.length === 0) {
      render(container, this._noListComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    const mainList = this._mainListComponent;
    render(container, mainList.getElement(), RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, this._showingCardsCount));
    this._renderLoadMoreButton();

    this._renderTopRated();
    this._renderMostComments();

  }

  _removeCards() {
    this._siteFilmListContainerElement.innerHTML = ``;
    this._showedCardsControllers = [];
    this._showingCardsCount = SHOWING_CARDS_COUNT_BY_BUTTON;
  }

  _renderCards(cards) {

    const newCards = renderCards(this._siteFilmListContainerElement, cards, this._onDataChange, this._onViewChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);
    this._showingCardsCount = this._showedCardsControllers.length;
  }

  _renderTopRated() {
    let countOfAllRating = 0;

    const getSortByRating = (arr) => {
      return arr.sort((a, b) => +a.rating > +b.rating ? -1 : 1);
    };

    this._cardsModel.getCards().forEach((card) => {
      countOfAllRating += +card.rating;
    });

    const sortByRating = getSortByRating(this._cardsModel.getCards().slice());

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

    this._cardsModel.getCards().forEach((card) => {
      countOfAllComment += +card.comments.length;
    });

    const getSortByComments = (arr) => {
      return arr.sort((a, b) => b.comments.length - a.comments.length);
    };

    const sortByComments = getSortByComments(this._cardsModel.getCards().slice());

    const mostCommented = this._mostCommentedComponent;
    if (countOfAllComment > 0) {
      render(this._container.getElement(), mostCommented.getElement(), RenderPosition.BEFOREEND);
    }

    const siteMostCommentsElements = mostCommented.getElement().querySelector(`#most-commented .films-list__container`);

    const newCards = renderCards(siteMostCommentsElements, sortByComments.slice(0, 2), this._onDataChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);

  }

  _renderLoadMoreButton() {
    if (this._showingCardsCount >= this._cardsModel.getCards().length) {
      return;
    }

    render(this._mainListComponent.getElement(), this._showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreCardsHandler(this._onShowMoreButtonClick);
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];

    switch (sortType) {
      case SortType.RATING:
        sortedCards = this._cardsModel.getCards().slice().sort((a, b) => +a.rating > +b.rating ? -1 : 1);
        break;
      case SortType.DATE:
        sortedCards = this._cardsModel.getCards().slice().sort((a, b) => a.date > b.date ? -1 : 1);
        break;
      case SortType.DEFAULT:
        sortedCards = this._cardsModel.getCards().slice(0, this._showingCardsCount);
        break;
    }

    this._removeCards();
    this._renderCards(sortedCards);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onShowMoreButtonClick() {
    const prevCardsCount = this._showingCardsCount;
    this._showingCardsCount = this._showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    const newCards = renderCards(this._siteFilmListContainerElement, this._cardsModel.getCards().slice(prevCardsCount, this._showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedCardsControllers = this._showedCardsControllers.concat(newCards);

    if (this._showingCardsCount >= this._cardsModel.getCards().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(CardController, oldData, newData, type) {
    if (type === `cardType`) {
      this._api.updateCard(oldData.id, newData)
          .then((cardModel) => {

            const isSuccess = this._cardsModel.updateCard(oldData.id, newData);

            if (isSuccess) {
              CardController.render(cardModel);
            }

          })
          .catch(() => {
            CardController.shakeRating();
          });
    } else if (type === `commentType`) {
      this._api.createComment(oldData.id, newData)
      .then((newCard) => {
        CardController.render(newCard);
      })
      .catch(() => {
        CardController.shakeComments();
      });
    } else {
      this._api.deleteComment(newData)
      .then(() => {
        CardController.render(oldData);
      });
    }

  }

  _onViewChange() {
    this._showedCardsControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, this._showingCardsCount));
    this._renderLoadMoreButton();
  }
}
