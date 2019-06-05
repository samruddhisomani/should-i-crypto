const fs = require("fs");

const lmnop = JSON.parse(fs.readFileSync("js/erapi.json", "utf8"))["rates"];

const idk = Object.keys(lmnop)
  .map(x => {
    return Object.keys(lmnop[x]).map(y => {
      return { date: x, name: y, price: lmnop[x][y] };
    });
  })
  .reduce((acc, val) => acc.concat(val), []);

fs.writeFileSync("erapiParsed.json", JSON.stringify(idk));
