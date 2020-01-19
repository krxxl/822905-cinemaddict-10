export default class Comment {
  constructor(data) {
    this.emoji = data[`emotion`];
    this.text = data[`comment`];
    this.author = data[`author`];
    this.commentDay = data[`date`];
    this.id = data[`id`];
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.author,
      'comment': this.text,
      'date': this.commentDay,
      'emotion': this.emoji
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
