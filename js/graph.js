const coingecko = d3.json("js/coingecko.json");

const forex = d3.json("js/erapi.json");

Promise.all([coingecko, forex]).then(values => {
  //TODO: Combine these together
  const coingecko = values[0].prices.map(item => [new Date(item[0]), item[1]]);
  const erapi = values[1].rates;

  const initWidth = 500;
  const initHeight = 500;

  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = initWidth - margin.left - margin.right, // Use the window's width
    height = initHeight - margin.top - margin.bottom; // Use the window's height

  function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  }

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(coingecko, d => d[0]))
    .range([0, initWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(coingecko, d => d[1]))
    .range([initHeight, 0]);

  const line = d3
    .line()
    .x(d => d[0])
    .y(d => d[1]);

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", initHeight)
    .attr("width", initWidth)
    .call(responsivefy);

  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "pink");

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));
});
