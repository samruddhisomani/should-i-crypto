fetch("chart.vl.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(spec) {
    vegaEmbed(".chart", spec);
  });
