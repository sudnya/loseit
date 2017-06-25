const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiaiApp = require('apiai')('d948e6c628624d1a819776dfffea42a5');

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    console.log("GET request on /webhook");
    console.log("Does body contain page?");
    console.log(req.body.object);
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
            console.log('hub.verify token is true');
            res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendMessage(event);
                }
            });
        });
        res.status(200).end();
    }
});

const request = require('request');

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'tabby_cat' // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: 'EAAV3AEZBbudgBABuT1ZAZAU1r3mIxZC0UvwVzHMXdLSknuYOBw2zLCw1xPoAHYNbQrLVf9prc9da3fAXSoMOLJI7gEmeZBb47ClNOXLIdVZCBeIyhEFXUJRbayZBABd7Abv16KPUbVKZB72IcwXfys956qvKA3jDceCK7ciqyle52rmH1sWQgXuPX2Aj4UdnVCgZD'},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: {text: aiText}
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    });
    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}
