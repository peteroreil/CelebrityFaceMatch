const ImageSearch = require('image-search-google');
const config = require('config');

const cseId = config.googleSdk.cseId;
const apiKey = config.googleSdk.apiKey;

const client = new ImageSearch(cseId, apiKey);
const options = { page: 1 };

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function getUrls(image) {
    return (image && image.url) ? image : undefined;
}

function search(name) {
    return client.search(`celebrity ${name}`, options)
        .then(images => images.filter(getUrls))
        .then((urls) => {
            let url;
            if (urls && urls.length) {
                const randIndex = getRandomInt(urls.length);
                url = urls[randIndex].url;
            }
            return url;
        });
}

module.exports = { search };
