let VIEW;

const formSubmit = () => {
  fetch("chart.vl.json", { mode: "cors" })
    .then(function(response) {
      return response.json();
    })
    .then(function(spec) {
      vegaEmbed(".chart", spec)
        .then(function(result) {
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
