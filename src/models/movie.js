export default class Card {
  constructor(data) {
    this.title = data.film_info[`title`],
    this.poster = data.film_info[`poster`],
    this.rating = data.film_info[`total_rating`],
    this.date = data.film_info.release[`date`],
    this.duration = data.film_info[`runtime`],
    this.genres = data.film_info[`genre`],
    // this.countComments = this.countComments(this.comments),
    this.description = data.film_info[`description`],
    this.isInWatchlist =  data.user_details[`watchlist`],
    this.isWatched =  data.user_details[`already_watched`],
    this.isFavorite =  data.user_details[`favorite`],
    this.age = data.film_info[`age_rating`],
    this.director = data.film_info[`director`],
    this.writers = data.film_info[`writers`],
    this.actors = data.film_info[`actors`],
    this.country = data.film_info.release[`release_country`],
    this.comments =  data[`comments`],
    this.id = data[`id`],
    this.dateWatched = data.user_details[`watching_date`],
    this.titleOrigin = data.film_info[`alternative_title`],
    this.personalRating = data.user_details[`personal_rating`]

    // this.id = data[`id`];
    // this.description = data[`description`] || ``;
    // this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    // this.tags = new Set(data[`tags`] || []);
    // this.repeatingDays = data[`repeating_days`];
    // this.color = data[`color`];
    // this.isFavorite = Boolean(data[`is_favorite`]);
    // this.isArchive = Boolean(data[`is_archived`]);
  }

  toRAW() {
    return {
      // 'id': this.id,
      // 'description': this.description,
      // 'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      // 'tags': Array.from(this.tags),
      // 'repeating_days': this.repeatingDays,
      // 'color': this.color,
      // 'is_favorite': this.isFavorite,
      // 'is_archived': this.isArchive,
    };
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }

  static clone(data) {
    return new Card(data.toRAW());
  }
}
