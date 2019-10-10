'use strict';

const logger = require('./logger');
const ImageProcessor = require('./ImageProcessor');
const CelebrityFaceMatch = require('./CelebrityFaceMatch');
const ImageSearch = require('./ImageSearch');

function SocketHandler(socket) {
    this.socket = socket;

    this.socket.on('image', (data) => {
        if (data) {
            const base64Img = ImageProcessor.stripHeader(data);
            ImageProcessor.faceDetect(base64Img)
                .then(processed => this.socket.emit('processed', processed))
                .then(() => CelebrityFaceMatch.match(base64Img))
                .then(match => ImageSearch.search(match.name)
                    .then((url) => {
                        const result = Object.assign({ url }, match);
                        this.socket.emit('match', result);
                    }))
                .catch((e) => {
                    if (e.message === 'noface') {
                        logger.warn('no face detected!');
                        this.socket.emit('whoops', 'we\'re sorry, it appears you don\'t have a face');
                    } else {
                        logger.error(e.message);
                        logger.error(e.stack);
                        this.socket.emit('whoops', 'we\'re sorry, it appears your face broke our application');
                    }
                });
        }
    });
}

module.exports = SocketHandler;
