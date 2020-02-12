const fetch = require('node-fetch');

async function getPrice(stock) {
  let raw = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);
  let price = await raw.json();
  return price.latestPrice;
}

module.exports = getPrice;