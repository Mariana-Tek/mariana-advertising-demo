/* eslint no-console: 0 */
/* eslint-env browser */

var adForm = document.getElementById('ad-form');
var adContainer = document.getElementById('ad-container');

function updateAd(data, err) {
    if (err) {
        console.error(err.msg);
    }

    while (adContainer.firstChild) {
        adContainer.removeChild(adContainer.firstChild);
    }

    if (data && !err) {
        var img = document.createElement('img');
        img.setAttribute('src', data.image_url);
        img.setAttribute('alt', 'Advertisement');

        var a = document.createElement('a');
        a.setAttribute('href', data.redirect_url);
        a.setAttribute('target', '_blank');
        a.appendChild(img);
        a.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(data.redirect_url, null, "height=285,width=550,resizable=1");
        });

        setTimeout(function() {
            adContainer.appendChild(a);
        }, 500);
    }
}

function getAd() {
    var request = new XMLHttpRequest();
    request.open('POST', adForm.action, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success
            updateAd(JSON.parse(this.response));
        } else {
            // Error
            updateAd(null, { msg: 'Error accessing ad server.' });
        }
    };

    request.send(JSON.stringify({ user_id: adForm.user_id.value }));
}

adForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    getAd();
});

setTimeout(getAd, 333);
