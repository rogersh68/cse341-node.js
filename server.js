const { response } = require('express')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/getRate', getRate)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function getRate(req, res) {
  const params = {weight: 15, type: "Letter (Stamped)", rate: 25.00};
  response.render('pages/result', params);
}