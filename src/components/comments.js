import AbstractComponent from './abstract-component.js';
import {formatDateComment} from '../utils/common.js';

const getEmojiUrl = (emoji) => {
  switch (emoji) {
    case `sleeping`:
      return `images/emoji/sleeping.png`;
    case `trophy`:
      return `images/emoji/trophy.png`;
    case `angry`:
      return `images/emoji/angry.png`;
    case `smile`:
      return `images/emoji/smile.png`;
    case `puke`:
      return `images/emoji/puke.png`;
  }
  return false;
};

const commentTemplate = (comment) => {
  let {emoji, text, author, commentDay, id} = comment;

  const emojiUrl = getEmojiUrl(emoji);

  if (text.length > 140) {
    text = text.slice(0, 139) + `...`;
  }
  const description = window.he.encode(text);
  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src=${emojiUrl} width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${description}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formatDateComment(commentDay)}</span>
        <button class="film-details__comment-delete" data-index="${id}" >Delete</button>
      </p>
    </div>
    </li>`
  );
};

const createCommentsTemplate = (comments) => {

  const countComments = comments.length;
  const comment = comments.map((it) => commentTemplate(it)).join(`\n`);
  return (
    `<section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>

          <ul class="film-details__comments-list">
            ${comment}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
  `
  );
};

export default class Comments extends AbstractComponent {

  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  setSendCommentHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, handler);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, handler);
  }
}
