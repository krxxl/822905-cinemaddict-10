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
const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};


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
      const newCard = Card.clone(card);
      newCard.isInWatchlist = !newCard.isInWatchlist;
      this._onDataChange(this, card, newCard, `cardType`);
    };

    const onWatched = (evt) => {
      evt.preventDefault();
      const newCard = Card.clone(card);
      newCard.isWatched = !newCard.isWatched;
      if (!newCard.isWatched) {
        newCard.personalRating = 0;
        newCard.watchedDate = ``;
      } else {
        newCard.watchedDate = new Date();
      }
      this._onDataChange(this, card, newCard, `cardType`);
    };

    const onFavorite = (evt) => {
      evt.preventDefault();
      const newCard = Card.clone(card);
      newCard.isFavorite = !newCard.isFavorite;
      this._onDataChange(this, card, newCard, `cardType`);
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


    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      this._renderComments(card);
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
    this._onViewChange();
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._popupComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._renderComments(card);

    this._mode = Mode.POPUP;
    document.addEventListener(`keydown`, (evt) => {
      this._onEscKeyDown(evt);
    });
  }

  _renderComments(card) {
    const id = card.id;
    api.getComments(id).then((comments) => {
      if (this._commentsComponent) {
        this._commentsComponent.getElement().remove();
      }
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

          this._onDataChange(this, card, comment, `commentType`);
        }
      });

      this._commentsComponent.setCloseButtonClickHandler((evt) => {
        evt.preventDefault();
        if (evt.target.className === `film-details__comment-delete`) {
          const commentId = +evt.target.dataset.index;
          this._onDataChange(this, card, commentId, `commentDel`);
        }

      });

      if (card.personalRating) {
        const buttons = document.querySelectorAll(`.film-details__user-rating-input`);
        buttons.forEach((button) => {
          if (+button.value === card.personalRating) {
            button.checked = true;
          }
        });
      }

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

  shakeComments() {
    this._commentsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._commentsComponent.getElement().querySelector(`.film-details__comment-input`).style.border = `1px solid red`;
    this._commentsComponent.getElement().querySelector(`.film-details__comment-input`).setAttribute(`disabled`, `true`);
    setTimeout(() => {
      this._commentsComponent.getElement().style.animation = ``;
      this._commentsComponent.getElement().querySelector(`.film-details__comment-input`).style.border = `none`;
      this._commentsComponent.getElement().querySelector(`.film-details__comment-input`).removeAttribute(`disabled`);

    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeRating() {
    this._popupComponent.getElement().querySelector(`.film-details__inner`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    const dots = this._popupComponent.getElement().querySelectorAll(`.film-details__user-rating-label`);
    dots.forEach((dot) => {
      dot.style.background = `red`;
    });
    this._popupComponent.getElement().querySelector(`.film-details__inner`).setAttribute(`disabled`, `true`);
    setTimeout(() => {
      this._popupComponent.getElement().querySelector(`.film-details__inner`).style.animation = ``;
      dots.forEach((dot) => {
        dot.style.background = ``;
      });
      this._popupComponent.getElement().querySelector(`.film-details__inner`).removeAttribute(`disabled`);

    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
