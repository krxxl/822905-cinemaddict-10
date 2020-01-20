import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import CommentsComponent from '../components/comments.js';
import API from '../api.js';
import Card from '../models/movie.js';
import Comment from '../models/comment.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';


const AUTHORIZATION = `Basic KJgykjbsdajfjasd=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;
const api = new API(END_POINT, AUTHORIZATION);

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

// const parseData = (data) => {

//   return new Comment ({
//     emoji: emojiUrl,
//     text: commentText,
//     commentDay: dateComment,
//   });
// };

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardComponent = null;
    this._popupComponent = null;
    this._commentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;
    // console.log(this._commentsComponent.getElement())
    this._cardComponent = new CardComponent(card);
    this._popupComponent = new PopupComponent(card);


    this._cardComponent.setPopupOpenHadlerHandler([`.film-card__poster`, `.film-card__title`, `.film-card__comments`], () => {
      this._openPopup(card);
      if (card.personalRating) {
        const buttons = document.querySelectorAll(`.film-details__user-rating-input`);
        buttons.forEach((button) => {
          if (+button.value === card.personalRating) {
            button.checked = true;
          }
        });
      }
    });

    this._popupComponent.setClosePopupHandler(() => {
      this._closePopup();
    });

    const onWatchList = (evt) => {
      evt.preventDefault();
      // const watchlist = document.querySelector(`#filter__watchlist`).querySelector(`.main-navigation__item-count`);
      // const watchlistVal = watchlist.innerText;
      // if (!card.isInWatchlist) {
      //   watchlist.innerText = +watchlistVal + 1;
      // } else {
      //   watchlist.innerText = +watchlistVal - 1;
      // }

      const newCard = Card.clone(card);
      newCard.isInWatchlist = !newCard.isInWatchlist;

      this._onDataChange(this, card, newCard, `cardType`);

      // this._onDataChange(this, card, Object.assign({}, card, {
      //   isInWatchlist: !card.isInWatchlist,
      // }));
    };

    const onWatched = (evt) => {
      evt.preventDefault();
      // const watched = document.querySelector(`#filter__history`).querySelector(`.main-navigation__item-count`);
      // const watchedVal = watched.innerText;
      // if (!card.isWatched) {
      //   watched.innerText = +watchedVal + 1;
      // } else {
      //   watched.innerText = +watchedVal - 1;
      // }
      const newCard = Card.clone(card);
      newCard.isWatched = !newCard.isWatched;
      if (!newCard.isWatched) {
        newCard.personalRating = 0;
        newCard.watchedDate = ``;
      } else {
        newCard.watchedDate = new Date();
      }

      this._onDataChange(this, card, newCard, `cardType`);

      // this._onDataChange(this, card, Object.assign({}, card, {
      //   isWatched: !card.isWatched,
      //   watchedDate: new Date()
      // }));
    };

    const onFavorite = (evt) => {
      evt.preventDefault();
      // const favorites = document.querySelector(`#filter__favorites`).querySelector(`.main-navigation__item-count`);
      // const favoritesVal = favorites.innerText;
      // if (!card.isFavorite) {
      //   favorites.innerText = +favoritesVal + 1;
      // } else {
      //   favorites.innerText = +favoritesVal - 1;
      // }
      const newCard = Card.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(this, card, newCard, `cardType`);

      // this._onDataChange(this, card, Object.assign({}, card, {
      //   isFavorite: !card.isFavorite,
      // }));
    };

    const onRating = (evt, rating) => {
      evt.preventDefault();
      const newCard = Card.clone(card);
      newCard.personalRating = +rating;

      this._onDataChange(this, card, newCard, `cardType`);
    };

    this._cardComponent.setWatchListButtonClickHandler((evt) => {
      onWatchList(evt);
    });

    this._popupComponent.setWatchListButtonClickHandler((evt) => {
      onWatchList(evt);
    });

    this._popupComponent.setMarkWatchedButtonClickHandler((evt) => {
      onWatched(evt);
    });

    this._cardComponent.setMarkWatchedButtonClickHandler((evt) => {
      onWatched(evt);
    });

    this._popupComponent.setUndoButtomClickHandler((evt) => {
      onWatched(evt);
    });

    this._popupComponent.setFavoriteButtonClickHandler((evt) => {
      onFavorite(evt);
    });

    this._cardComponent.setFavoriteButtonClickHandler((evt) => {
      onFavorite(evt);
    });

    this._popupComponent.setPersonalRating((evt) => {
      evt.preventDefault();
      const rating = evt.target.value;

      onRating(evt, rating);
    });

    // this._popupComponent.setCloseButtonClickHandler((evt) => {
    //   evt.preventDefault();
    //   // console.log(evt)
    //   if (evt.target.className === `film-details__comment-delete`) {
    //     const index = +evt.target.dataset.index;

    //     this._onDataChange(this, card, Object.assign({}, card, {
    //       countComments: card.countComments - 1,
    //       comments: [].concat(card.comments.slice(0, index), card.comments.slice(index + 1)),
    //     }));
    //   }

    // });

    // this._popupComponent.setSendCommentHandler((evt) => {
    //   if (evt.keyCode === 13 && evt.ctrlKey) {
    //     const commentText = this._popupComponent.getElement().querySelector(`.film-details__comment-input`).value;
    //     const dateComment = new Date();
    //     let emojiUrl = ``;
    //     const emojies = this._popupComponent.getElement().querySelectorAll(`.film-details__emoji-item`);
    //     emojies.forEach((emoji) => {
    //       if (emoji.checked) {
    //         emojiUrl = emoji.nextElementSibling.querySelector(`img`).src;
    //       }
    //     });

    //     const comment = {
    //       emoji: emojiUrl,
    //       text: commentText,
    //       author: `somebody`,
    //       commentDay: dateComment,
    //     };
    //     this._onDataChange(this, card, Object.assign({}, card, {
    //       countComments: card.countComments + 1,
    //       comments: [].concat(comment, card.comments.slice(0)),
    //     }));
    //   }
    // });

    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      const id = card.id;
      api.getComments(id).then((comments) => {
        this._commentsComponent = new CommentsComponent(comments);
        render(this._popupComponent.getElement().querySelector(`.form-details__bottom-container`), this._commentsComponent.getElement(), RenderPosition.BEFOREEND);
      });
      if (card.personalRating) {
        const buttons = document.querySelectorAll(`.film-details__user-rating-input`);
        buttons.forEach((button) => {
          if (+button.value === card.personalRating) {
            button.checked = true;
          }
        });
      }
    } else {

      render(this._container, this._cardComponent.getElement(), RenderPosition.BEFOREEND);
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup(card) {
    const id = card.id;
    this._onViewChange();
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._popupComponent.getElement(), RenderPosition.AFTERBEGIN);
    api.getComments(id).then((comments) => {
      this._commentsComponent = new CommentsComponent(comments);
      render(this._popupComponent.getElement().querySelector(`.form-details__bottom-container`), this._commentsComponent.getElement(), RenderPosition.BEFOREEND);

      this._commentsComponent.setSendCommentHandler((evt) => {
        if (evt.keyCode === 13 && evt.ctrlKey) {
          const commentText = this._commentsComponent.getElement().querySelector(`.film-details__comment-input`).value;
          const dateComment = new Date();
          let emojiUrl = ``;
          const emojies = this._commentsComponent.getElement().querySelectorAll(`.film-details__emoji-item`);
          emojies.forEach((emoji) => {
            if (emoji.checked) {
              emojiUrl = emoji.id.slice(6);
            }
          });

          const comment = new Comment({
            'emotion': emojiUrl,
            'comment': commentText,
            'date': dateComment,
          });
          console.log(comment)
          this._onDataChange(this, card, comment, `commentType`);
        }
      });
    });


    this._mode = Mode.POPUP;
    document.addEventListener(`keydown`, (evt) => {
      this._onEscKeyDown(evt);
      // this._onCtrlEnterDown(evt);
    });
  }

  _closePopup() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  // _onCtrlEnterDown(evt) {
  //   if (evt.keyCode === 13 && evt.ctrlKey) {
  //     const comment = this._popupComponent.getElement().querySelector(`.film-details__comment-input`).value;

  //     this._onDataChange(this, card, Object.assign({}, card, {
  //       countComments: card.countComments + 1,
  //       comments: [].concat(card.comments.slice(0, index), card.comments.slice(index + 1)),
  //     }));
  //   }
  // }
}
