import {getRandomIntegerNumber} from '../utils.js';
import {MonthNames} from '../const.js';

const filmNames = [
  `Побег из Шоушенка`,
  `Зеленая миля`,
  `Форрест Гамп`,
  `Список Шиндлера`,
  `1+1 `,
  `Начало`,
  `Леон`,
  `Король Лев`,
  `Бойцовский клуб`,
  `Иван Васильевич меняет профессию`,
  `Жизнь прекрасна`,
  `Достучаться до небес`,
  `Крестный отец`,
  `Криминальное чтиво`,
  `Операция «Ы» и другие приключения Шурика`
];

const picUrl = `images/posters/`;

const posterSrc = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const genreNames = [
  `Musical`,
  `Triller`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`
];

const directorNames = [
  `Anthony Mann`,
  `Фрэнк Дарабонт`,
  `Роберт Земекис`,
  `Оливье Накаш`,
  `Кристофер Нолан`,
  `Люк Бессон`,
  `Роджер Аллерс`,
  `Леонид Гайдай`,
  `Роберто Бениньи`,
  `Фрэнсис Форд Коппола`
];

const countryNames = [
  `США`,
  `Россия`,
  `Германия`,
  `Италия`,
  `Франция`,
  `Индия`
];

const emojiUrl = `images/emoji/`;

const emojiSrc = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`,
  `trophy.png`
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const strArray = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `);

const getRandomFloatNumber = (min, max) => {
  return (min + max * Math.random()).toFixed(1);
};

const getRandomYear = () => {
  const firstMovie = 1985;
  const curDate = new Date();
  return getRandomIntegerNumber(firstMovie, curDate.getFullYear());
};

const getDuration = () => {
  let randomTime = getRandomIntegerNumber(0, 180);
  let hours = randomTime / 60 ^ 0;
  if (hours) {
    let min = randomTime % 60;
    if (min < 10) {
      min = `0 ${min}`;
    }
    randomTime = `${hours}h ${min}m`;
  } else {
    randomTime = `${randomTime}m`;
  }
  return randomTime;
};

const getCountComments = () => {
  return getRandomIntegerNumber(0, 5);
};


const generateString = (count, array) => {
  let str = ``;
  for (let i = 0; i < count; i++) {
    str += `${getRandomArrayItem(array)}. `;
  }
  return str;
};

const getGenres = (count) => {
  let genresArray = [];
  for (let i = 0; i < count; i++) {
    genresArray.push(getRandomArrayItem(genreNames));
  }
  return genresArray;
};

const generateComment = () => {
  return {
    emoji: `${emojiUrl}${getRandomArrayItem(emojiSrc)}`,
    text: generateString(getRandomIntegerNumber(1, 3), strArray),
    author: getRandomArrayItem(directorNames),
    commentDay: `2019/12/31 23:59`,
  };
};

const generateComments = (count) => {
  let commentsArray = [];

  for (let i = 0; i < count; i++) {
    commentsArray.push(generateComment());
  }
  return commentsArray;
};

const generateCard = () => {
  let countComment = getCountComments();
  return {
    title: getRandomArrayItem(filmNames),
    raiting: getRandomFloatNumber(0, 10),
    year: getRandomYear(),
    duration: getDuration(),
    genres: getGenres(getRandomIntegerNumber(1, 3)),
    poster: `${picUrl}${getRandomArrayItem(posterSrc)}`,
    countComments: countComment,
    description: generateString(getRandomIntegerNumber(1, 3), strArray),
    age: `${getRandomIntegerNumber(0, 99)}+`,
    director: getRandomArrayItem(directorNames),
    writers: generateString(getRandomIntegerNumber(1, 3), directorNames),
    actors: generateString(getRandomIntegerNumber(1, 3), directorNames),
    date: `${getRandomIntegerNumber(1, 30)} ${getRandomArrayItem(MonthNames)}`,
    country: getRandomArrayItem(countryNames),
    comments: generateComments(countComment)
  };
};


const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};


export {generateCard, generateCards};