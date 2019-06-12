const ShouldICrypto = {
  getCrypto: function (coin) {
    const baseUrl = 'https://api.coingecko.com/api/v3/';
    const path = 'coins/' + coin + '/market_chart/range';
    const from = moment().subtract(7, 'days').unix();
    const to = moment().unix();
    const params = '?vs_currency=gbp&from=' + from + '&to=' + to;
    return axios.get(baseUrl + path + params);
  },
  getFiat: function (currency) {
    const baseUrl = 'https://api.exchangeratesapi.io/';
    const path = 'history';
    const startAt = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const endAt = moment().format('YYYY-MM-DD');
    const params = '?base=GBP' + '&start_at=' + startAt + '&end_at=' + endAt + "&symbols=" + currency;
    return axios.get(baseUrl + path + params);
  },
  getData: function (coin, currency) {
    return axios.all([this.getCrypto(coin), this.getFiat(currency)]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  ShouldICrypto.getData('bitcoin', 'USD').then(function (response) {
    let crypto = response[0].data.prices;
    let fiat = response[1].data.rates;
    let cryptoParsed = crypto.map(function (a) {
      return {
        x: a[0],
        y: a[1]
      };
    });
    let fiatParsed = Object.keys(fiat).map(function (b) {
      return {
        x: moment(b).unix(),
        y: fiat[b].USD
      }
    })

    console.log(cryptoParsed);
    console.log(fiatParsed);

    var graph = new Rickshaw.Graph({
      element: document.querySelector('#graph'),
      series: [
        {
          color: 'red',
          data: cryptoParsed
        }, {
          color: 'blue',
          data: fiatParsed
        }
      ]
    });
    graph.render();
  })
})

let VIEW;

const formSubmit = () => {
  fetch("chart.vl.json", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (spec) {
      vegaEmbed(".chart", spec)
        .then(function (result) {
          // result.view is the Vega View, vlSpec is the original Vega-Lite specification
          VIEW = result.view;
          const x = document.querySelector(".chart");
          VIEW.width(x.clientWidth)
            .height(x.clientHeight)
            .run();
        })
        .catch(console.error);
    });
};

// resize code from
// view-source:https://streeteasy-market-data-api.s3.amazonaws.com/vis/v3.1/js/main.js
window.addEventListener("resize", () => {
  const x = document.querySelector(".chart");
  VIEW.width(x.clientWidth)
    .height(x.clientHeight)
    .run();
});