const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const app = express();
const port = process.env.PORT || 7000;
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;


nunjucks.configure(path.join(__dirname, 'templates'), {
  autoescape: true,
  cache: false,
  express: app
});


app.use(bodyParser.json());

app.get('/', (req, res) => {
    const context = {
        exampleURL: `${baseURL}/ad-example`,
    };

    res.render('index.html', context);
});

app.post('/', (req, res) => {

    // make your changes here!

    const user = req.body.user_id ? `user ${req.body.user_id}` : 'anonymous user';
    const imageURL = `https://via.placeholder.com/640x480/422F4D/FFFFFF.png?text=${encodeURI(`Ad for ${user}`)}`;
    let redirectURL = `${baseURL}/redirect-example`;
    
    // by adding the user_id as a query parameter in the redirect url here, you will be able to customize the content that the user sees when they click on your ad in the app.
    if (req.body.user_id) {
        redirectURL = redirectURL + `?user_id=${req.body.user_id}`
    }

    // the following is required

    // const adData = {
    //     image_url: imageURL,
    //     redirect_url: redirectURL
    // };

    const adData = {this_is: "wrong"};
    res.send(adData);
});


app.get('/ad-example', (req, res) => {
    const userID = req.query.user_id;
    
    axios.post(baseURL, {
        user_id: userID
      })
      .then(function (response) {
        const context = {
            imageURL: response.data.image_url,
            redirectURL: response.data.redirect_url,
            queryExampleURL: baseURL + "/ad-example?user_id=123"
        };

        res.render('ad-example.html', context);
      });
});

app.get('/redirect-example', (req, res) => {
    const user = req.query.user_id ? `user ${req.query.user_id}` : 'anonymous user';
    const context = {
        user: user
    };

    res.render('redirect-example.html', context);
});

app.listen(port, () => console.log(`Example app listening on ${baseURL}!`));
