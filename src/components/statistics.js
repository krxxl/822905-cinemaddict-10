import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const createColor = () => {
  return `#ffe800`;
};

const createArray = (cards, dateFrom, dateTo) => {

  const watchedCards = cards;

  return watchedCards.filter((card) => {
    const watched = card.dateWatched;
    return watched >= dateFrom && watched <= dateTo;
  });
};

const renderGenresChart = (tagsCtx, cards) => {
  const genresLabels = cards.map((card) => card.genres)
    .reduce((acc, genres) => {
      return acc.concat(Array.from(genres));
    }, [])
    .filter(getUniqItems);


  return new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresLabels,
      datasets: [{
        data: genresLabels.map((genre) => cards.reduce((acc, card) => {
          const targetCardsCount = Array.from(card.genres)
            .filter((it) => it === genre).length;

          return acc + targetCardsCount;
        }, 0)).slice().sort((a, b) => b - a),
        backgroundColor: genresLabels.map(createColor),
        barThickness: 20,
        minBarLength: 0,
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            display: true,

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
            display: true
          }
        }]
      },
      plugins: {
        datalabels: {
          display: true,
          anchor: `start`,
          color: 'white',
          labels: {
            title: {
              font: {
                weight: 'bold',
                size: 20,
              }
            },
            // value: {
            //   color: 'green'
            // }
          }
        }
      },
      // tooltips: {
      //   callbacks: {
      //     label: (tooltipItem, data) => {
      //       const allData = data.datasets[tooltipItem.datasetIndex].data;
      //       const tooltipData = allData[tooltipItem.index];

      //       const total = allData.reduce((acc, it) => acc + parseFloat(it));
      //       const tooltipPercentage = Math.round((tooltipData / total) * 100);

      //       return `${tooltipData} TASKS — ${tooltipPercentage}%`;
      //     }
      //   },
      //   displayColors: false,
      //   backgroundColor: `#ffffff`,
      //   bodyFontColor: `#000000`,
      //   borderColor: `#000000`,
      //   borderWidth: 1,
      //   cornerRadius: 0,
      //   xPadding: 15,
      //   yPadding: 15
      // },
      // title: {
      //   display: true,
      //   text: `Custom Chart Title`,
      // },
      legend: {
        display: false,
        // position: `left`,
        // labels: {
        // //   boxWidth: 15,
        // //   padding: 25,
        // //   fontStyle: 500,
        // //   fontColor: `#000000`,
        // //   fontSize: 13
        // // }
        // generateLabels: function(chart) {
        //   var labels = chart.data.labels;
        //   var dataset = chart.data.datasets[0];
        //   var legend = labels.map(function(label, index) {
        //   return {
        //   datasetIndex: 0,
        //   fillStyle: dataset.backgroundColor && dataset.backgroundColor[index],
        //   strokeStyle: dataset.borderColor && dataset.borderColor[index],
        //   lineWidth: dataset.borderWidth,
        //   text: label
        //   }
        //   });
        //   return legend;
        //   }
        // }
      }
    }
  });
};

const createStatisticsTemplate = ({cards, dateFrom, dateTo}) => {
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
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
          <p class="statistic__item-text">22 <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">130 <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">Sci-Fi</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor({cards}) {
    super();

    this._cards = cards.getCards();

    this._genresCtx = null;


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
  }

  getTemplate() {
    return createStatisticsTemplate(this._cards);
  }

  getArray(filter) {
    let newArray = [];
    const dateTo = new Date();
    let dateFrom = null;
    switch (filter) {
      case `statistic-all-time`:
        console.log(`statistic-all-time`);
        break;
      case `statistic-today`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getDate() - 1);
          return d;
        })();

        newArray = createArray(this._cards, dateFrom, dateTo);

        break;
      case `statistic-week`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getDate() - 7);
          return d;
        })();
        newArray = createArray(this._cards, dateFrom, dateTo);
        break;
      case `statistic-month`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getMonth() - 1);
          return d;
        })();
        newArray = createArray(this._cards, dateFrom, dateTo);
        break;
      case `statistic-year`:
        dateFrom = (() => {
          const d = new Date(dateTo);
          d.setDate(d.getFullYear() - 1);
          return d;
        })();
        newArray = createArray(this._cards, dateFrom, dateTo);
        break;
    }

    return newArray;
  }

  setPeriodChangeHandler() {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const filterName = evt.target.id;
      console.log(`dsfh`)
      this.rerender(this.getArray(filterName));
    });
  }
}
