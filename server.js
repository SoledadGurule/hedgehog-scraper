const express = require('express');
const app = express();
const cors = require('cors');
const Nightmare = require('nightmare');

const port = 3000;

app.use(cors());

// first endpoint - already built
// this says that when the app is at "/" - so "home", it will send a response of "Hedgehog Time". That is why we see those words on the screen when we go to localhost:3000/.
app.get('/', (req, res) => {
  res.send("Snake");
});

app.get('/pets', (req, res) => {
  res.send("i love dogs!");
});

// your endpoint

// scraper endpoint



app.get('/hedgie/:keyword', (req, res) => {
  var keyword = req.params.keyword;
//we are telling this function to find this keyword
  function findHedgieImage(keyword) {
    var nightmare = Nightmare({ show: true });
//we are starting to tell it to give back.
    return nightmare
    //nightmare is a library for the scraper
      .goto('https://www.google.com')
      //to go to this website
      .insert('input[title="Search"]', `hedgehog ${keyword}`)
      //
      .click('input[value="Google Search"]')
      .wait('a.q.qs')
      .click('a.q.qs')
      .wait('div#res.med')
      .evaluate(function() {
        var photoDivs = document.querySelectorAll('img.rg_ic');
        var list = [].slice.call(photoDivs);

        return list.map(function(div) {
          return div.src;
        });
      })
      .end()
      .then(function (result) {
        return result.slice(1, 5);
      })
      .then(function (images) {
        res.json(images);
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });
  }

  findHedgieImage(keyword);

});


app.listen(port, () => {
  console.log(`app running on ${port}`);
});
