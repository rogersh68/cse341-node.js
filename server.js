const { response } = require('express');
const express = require('express');
const path = require('path');
const url = require('url');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/getRate', getRate);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


function getRate(req, res) {
  let query = url.parse(req.url, true).query;
  let weight = Number(query.weight);
  let type = query.type;
  let rate = calculateRate(weight, type);
  if (rate == NaN) {
    rate = "Incorrect values";
  }
  const params = {weight: weight, type: type, rate: rate.toFixed(2)}
  res.render('pages/result', params);
}

function calculateRate(weight, type) {
  let rate;
  switch (type) {
    case 'Letters (Stamped)':
      if (weight <= 1) {rate = 0.55;}
      else if (weight <=2) {rate = 0.70;}
      else if (weight <=3) {rate = 0.85;}
      else if (weight <=3.5) {rate = 1.00;}
      else {rate = NaN;}
      break;

    case 'Letters (Metered)':
      if (weight <= 1) {rate = 0.50;}
      else if (weight <=2) {rate = 0.65;}
      else if (weight <=3) {rate = 0.80;}
      else if (weight <=3.5) {rate = 0.95;}
      else {rate = NaN;}
      break;

    case 'Large Envelopes (Flats)':
      if (weight <= 1) {rate = 1.00;}
      else if (weight <=2) {rate = 1.20;}
      else if (weight <=3) {rate = 1.40;}
      else if (weight <=4) {rate = 1.60;}
      else if (weight <=5) {rate = 1.80;}
      else if (weight <= 6) {rate = 2.00;}
      else if (weight <= 7) {rate = 2.20;}
      else if (weight <= 8) {rate = 2.40;}
      else if (weight <= 9) {rate = 2.60;}
      else if (weight <= 10) {rate = 2.80;}
      else if (weight <= 11) {rate = 3.00;}
      else if (weight <= 12) {rate = 3.20;}
      else if (weight <= 13) {rate = 3.40;}
      else {rate = NaN;}
      break;

    case 'First-Class Package Service--Retail':
      if (weight <= 4) {rate = 3.80;}
      else if (weight <= 8) {rate = 4.60;}
      else if (weight <= 12) {rate = 5.30;}
      else if (weight <= 13) {rate = 5.90;}
      else {rate = NaN;}
      break;

    default:
      rate = NaN;
      break;
  }

  return rate;
}