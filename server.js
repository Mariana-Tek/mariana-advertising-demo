/* eslint no-console: 0 */
/* eslint-env node, es6 */

const bodyParser = require('body-parser');
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const port = process.env.PORT || 7000;
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

const colors = {
    default: '210553',
    showcase: 'e43362'
}
const showcaseUserIDs = ['123', '456'];


nunjucks.configure(path.join(__dirname, 'templates'), {
  autoescape: true,
  cache: false,
  express: app
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function isShowcaseUser(userID) {
    return showcaseUserIDs.indexOf(userID) != -1;
}


app.get('/', (req, res) => {
    const context = {
        exampleURL: `${baseURL}/ad-example`,
    };

    res.render('index.html', context);
});


app.post('/ad', (req, res) => {
    const userID = req.body.user_id;

    let user = 'Anonymous User';
    if (userID) {
        user = `User ${userID}`;
    }

    let color = colors.default;
    if (isShowcaseUser(userID)) {
        color = colors.showcase;
    }

    const imageURL = `https://via.placeholder.com/300x250/${color}/FFFFFF.png?text=${encodeURI(`Ad for ${user}`)}`;
    let redirectURL = `${baseURL}/landing-page`;

    // by adding the user_id as a query parameter in the redirect url here,
    // you will be able to customize the content that the user sees when they click on your ad in the app.
    if (req.body.user_id) {
        redirectURL = redirectURL + `?user_id=${req.body.user_id}`
    }

    // this is the interface that must be implemented
    const adResponse = {
        image_url: imageURL,
        redirect_url: redirectURL
    };

    res.send(adResponse);
});


app.get('/landing-page', (req, res) => {
    const userID = req.query.user_id;

    const context = {
        user_id: userID,
        is_showcase_user: isShowcaseUser(userID)
    };

    res.render('landing-page.html', context);
});


app.listen(port, () => console.log(`Example app listening on ${baseURL}!`));
