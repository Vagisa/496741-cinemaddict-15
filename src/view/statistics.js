import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import dayjsDurationPlugin from 'dayjs/plugin/duration';
import { DateRanges } from '../const';

const BAR_HEIGHT = 50;

dayjs.extend(dayjsDurationPlugin);

const renderStatisticChart = (statisticCtx, stats) => (
  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: stats.favoritGenres.map((genre) => genre[0]),
      datasets: [{
        data: stats.favoritGenres.map((genre) => genre[1]),
        barThickness: 24,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {datalabels: {
        font: {size: 20}, color: '#ffffff', anchor: 'start', align: 'start', offset: 40,
      },
      },
      scales: {yAxes: [{
        ticks: {fontColor: '#ffffff', padding: 100, fontSize: 20},
        gridLines: { display: false, drawBorder: false },
      }],
      xAxes: [{
        ticks: {display: false, beginAtZero: true},
        gridLines: { display: false, drawBorder: false },
      }],
      },
      legend: {display: false},
      tooltips: {enabled: false},
    },
  })
);


const createStatisticsTemplate = (stats, dateRange, userRank) => (
  `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${dateRange === DateRanges.ALL_TIME ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${dateRange === DateRanges.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${dateRange === DateRanges.WEEK ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${dateRange === DateRanges.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${dateRange === DateRanges.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${stats.historyFilmsCount}<span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text"> ${stats.historyFilmsDurationHours} <span class="statistic__item-description">h</span> ${stats.historyFilmsDurationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${stats.mostFavoritGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`);

export default class Statistics extends SmartView {
  constructor(filmsModel) {
    super();

    this._data = {
      filmsModel: filmsModel,
      userRank: filmsModel.getUserRank(),
      dateFrom: null,
      dateTo: null,
      dateRange: DateRanges.ALL_TIME,
    };

    this.updateElement = this.updateElement.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._getStatsData = this._getStatsData.bind(this);
    this._handleDateClick = this._handleDateClick.bind(this);

    this._setCharts();
    filmsModel.addObserver(this.updateElement);
    this.restoreHandlers();
  }

  getTemplate() {
    const stats = this._getStatsData();
    return createStatisticsTemplate(
      stats,
      this._data.dateRange,
      this._data.userRank,
    );
  }

  _getStatsData() {
    const filmsInDataRange = this._data.filmsModel.getFilms()
      .filter((film) => {
        const watchingDate = dayjs(film.watchingDate);
        return (this._data.dateFrom === null || watchingDate.isAfter(this._data.dateFrom))
        && (!this._data.dateTo || watchingDate.isBefore(this._data.dateTo));
      });
    const historyFilms = filmsInDataRange.filter((film) => film.isHistory);
    const durationMinuts = historyFilms.reduce((sum, film) => sum + film.duration, 0);
    const genresCounters = {};
    historyFilms.forEach((film) => {
      film.genres.forEach((genre) => {
        if (!(genre in genresCounters)) {
          genresCounters[genre] = 0;
        }
        genresCounters[genre] += 1;
      });
    });
    const favoritGenres = Object.entries(genresCounters).sort((a, b) => b[1] - a[1]);
    let mostFavoritGenre = '';
    if (favoritGenres.length) {
      mostFavoritGenre = favoritGenres[0][0];
    }
    return {
      historyFilmsCount: historyFilms.length,
      historyFilmsDurationHours: Math.floor(durationMinuts / 60),
      historyFilmsDurationMinutes: String(durationMinuts % 60).padStart(2, 0),
      mostFavoritGenre,
      favoritGenres,
    };
  }

  _setCharts() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    statisticCtx.height = BAR_HEIGHT * 5;
    const stats = this._getStatsData();
    renderStatisticChart(statisticCtx, stats);
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  _handleDateClick(evt) {
    const period = evt.target.value;
    switch(period) {
      case DateRanges.ALL_TIME:
        this.updateData({
          dateFrom: null,
          dateTo: null,
          dateRange: period,
        });
        break;
      case DateRanges.TODAY:
        this.updateData({
          dateFrom: dayjs().startOf('day'),
          dateTo: dayjs().toDate(),
          dateRange: period,
        });
        break;
      case DateRanges.WEEK:
        this.updateData({
          dateFrom: dayjs().startOf('week'),
          dateTo: dayjs().toDate(),
          dateRange: period,
        });
        break;
      case DateRanges.MONTH:
        this.updateData({
          dateFrom: dayjs().startOf('month'),
          dateTo: dayjs().toDate(),
          dateRange: period,
        });
        break;
      case DateRanges.YEAR:
        this.updateData({
          dateFrom: dayjs().startOf('year'),
          dateTo: dayjs().toDate(),
          dateRange: period,
        });
        break;
    }
  }

  updateElement() {
    super.updateElement();
    this._setCharts();
  }

  restoreHandlers() {
    this.getElement()
      .querySelectorAll('.statistic__filters-input')
      .forEach((el) => el.addEventListener('click', this._handleDateClick));
  }
}
