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
      //bot goes to website
      .insert('input[title="Search"]', `hedgehog ${keyword}`)
      //what bot needs to search for + keyword
      .click('input[value="Google Search"]')
      //bot clicks google search button
      .wait('a.q.qs')
      //wait for the link to show up
      .click('a.q.qs')
      //bot clicks on link (after it shows up)
      .wait('div#res.med')
      //wait for div to appear (container for images)
      .evaluate(function() {
        var photoDivs = document.querySelectorAll('img.rg_ic');
        var list = [].slice.call(photoDivs); //bot puts all photo container into one collection

        return list.map(function(div) {
          return div.src;
        }); //bot gives us a collection of image links
      })
      .end()
      .then(function (result) {
        return result.slice(1, 5); //bot takes first four photo
      })
      .then(function (images) {
        res.json(images); //bot gives back images to the user 
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
