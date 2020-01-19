import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getRank} from '../mock/filter.js';
// import {duration} from 'moment';

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const createColor = () => {
  return `#ffe800`;
};

const createArray = (cards, dateFrom, dateTo) => {
  return cards.slice().filter((card) => {
    const watched = new Date(card.dateWatched);
    return watched >= dateFrom && watched <= dateTo;
  });
};

const getGenresLabels = (cards) => {
  return cards.map((card) => card.genres)
  .reduce((acc, genres) => {
    return acc.concat(Array.from(genres));
  }, [])
  .filter(getUniqItems);
};

const getGenresData = (genresLabels, cards) => {
  return genresLabels.map((genre) => cards.reduce((acc, card) => {
    const targetCardsCount = Array.from(card.genres)
      .filter((it) => it === genre).length;

    return acc + targetCardsCount;
  }, 0));
};

const sortArrays = (arrayLabel, arrayData) => {

  const arrayOfObj = arrayLabel.map((d, i) => {
    return {
      label: d,
      data: arrayData[i] || 0
    };
  });

  const sortedArrayOfObj = arrayOfObj.sort((a, b) => {
    return b.data - a.data;
  });


  let genresLabels = [];
  let sortedGenres = [];
  sortedArrayOfObj.forEach((d) => {
    genresLabels.push(d.label);
    sortedGenres.push(d.data);
  });

  return {genresLabels, sortedGenres};
};

const getArrays = (cards) => {
  const genresLabels = getGenresLabels(cards);
  const genresData = getGenresData(genresLabels, cards);

  return sortArrays(genresLabels, genresData);
};

const totalDuration = (cards) => {
  let sumDuration = 0;
  cards.forEach((card) => {
    sumDuration += +card.duration;

  });
  let hours = sumDuration / 60 ^ 0;
  let min;
  if (hours) {
    min = sumDuration % 60;
    if (min < 10) {
      min = `0 ${min}`;
    }
  }

  return {hours, min};
};

const getMostWatcheble = (cards) => {

  const {genresLabels, sortedGenres} = getArrays(cards);
  // console.log(genresLabels)
  // console.log(sortedGenres)

  // const genresLabels = cards.map((card) => card.genres)
  //   .reduce((acc, genres) => {
  //     return acc.concat(Array.from(genres));
  //   }, [])
  //   .filter(getUniqItems);

  // const sortedGenres = genresLabels.map((genre) => cards.reduce((acc, card) => {
  //   const targetCardsCount = Array.from(card.genres)
  //     .filter((it) => it === genre).length;

  //   return acc + targetCardsCount;
  // }, 0));

  const maxIndex = sortedGenres.indexOf(Math.max.apply(null, sortedGenres));

  return genresLabels[maxIndex];

};

const renderGenresChart = (tagsCtx, cards) => {
  // const genresLabels = cards.map((card) => card.genres)
  //   .reduce((acc, genres) => {
  //     return acc.concat(Array.from(genres));
  //   }, [])
  //   .filter(getUniqItems);
  const {genresLabels, sortedGenres} = getArrays(cards);

  return new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresLabels,
      datasets: [{
        data: sortedGenres,
        backgroundColor: genresLabels.map(createColor),
        barThickness: 20,
        minBarLength: 0,
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            display: false,

          },
          ticks: {
            display: false,
            beginAtZero: true,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            padding: 40,
            fontColor: `#FFFFFF`,
            fontSize: 14,
            display: true,
          }
        }]
      },
      plugins: {
        datalabels: {
          display: true,
          anchor: `start`,
          align: `left`,
          color: `white`,
          labels: {
            title: {
              font: {
                size: 14,
              }
            },

          }
        }
      },

      legend: {
        display: false,
      },
    }
  });
};

const createStatisticsTemplate = (allcards, cards) => {
  const rank = getRank(allcards.length);
  let watchedFilmCount = cards.length;
  let {hours, min} = totalDuration(cards);
  let mostWatcheble = getMostWatcheble(cards);


  if (!watchedFilmCount) {
    watchedFilmCount = 0;
  }

  if (!hours) {
    hours = 0;
  }

  if (!min) {
    min = 0;
  }

  if (!mostWatcheble) {
    mostWatcheble = `-`;
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${min} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${mostWatcheble}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards) {
    super();

    this._cards = cards;
    this._allCards = cards;

    this._genresCtx = null;
    this._filterName = `statistic-all-time`;


    this._renderCharts();
  }


  _renderCharts() {
    const element = this.getElement();

    const genresCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._genresChart = renderGenresChart(genresCtx, this._cards);

  }

  _resetCharts() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  recoveryListeners() {
    this.setPeriodChangeHandler();
  }

  show() {
    super.show();

    this.rerender(this._cards);
  }

  rerender(cards) {
    this._cards = cards;

    super.rerender();

    this._renderCharts();

    this.getElement().querySelector(`#${this._filterName}`).checked = true;
  }

  getTemplate() {
    return createStatisticsTemplate(this._allCards, this._cards);
  }

  getArray(filter, array) {

    let newArray = [];
    const dateTo = new Date();
    let dateFrom = null;
    switch (filter) {
      case `statistic-all-time`:
        newArray = array;
        break;
      case `statistic-today`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getDate() - 1);
          return d;
        })();

        newArray = createArray(array, dateFrom, dateTo);
        break;
      case `statistic-week`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getDate() - 7);
          return d;
        })();
        newArray = createArray(array, dateFrom, dateTo);
        break;
      case `statistic-month`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getMonth() - 1);
          return d;
        })();
        newArray = createArray(array, dateFrom, dateTo);
        break;
      case `statistic-year`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getDate() - 364);
          return d;
        })();
        newArray = createArray(array, dateFrom, dateTo);
        break;
    }

    return newArray;
  }

  setPeriodChangeHandler() {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._filterName = evt.target.id;

      this.rerender(this.getArray(this._filterName, this._allCards));
    });
  }
}
