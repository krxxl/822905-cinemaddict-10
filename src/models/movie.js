export default class Card {
  constructor(data) {
    this.title = data.film_info[`title`],
    this.poster = data.film_info[`poster`],
    this.rating = data.film_info[`total_rating`],
    this.date = data.film_info.release[`date`],
    this.duration = data.film_info[`runtime`],
    this.genres = data.film_info[`genre`],
    this.description = data.film_info[`description`],
    this.isInWatchlist = data.user_details[`watchlist`],
    this.isWatched = data.user_details[`already_watched`],
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
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.titleOrigin,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.date,
          'release_country': this.country
        },
        'runtime': this.duration,
        'genre': this.genres,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.isInWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.dateWatched,
        'favorite': this.isFavorite
      }
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
