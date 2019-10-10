'use strict';

const cv = require('opencv4nodejs');

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

function base64ToMat(base64Img) {
    const buffer = Buffer.from(base64Img, 'base64');
    return cv.imdecodeAsync(buffer);
}

function detectFace(mat) {
    return mat.bgrToGrayAsync()
        .then(grayscale => classifier.detectMultiScale(grayscale))
        .then((detection) => {
            const copy = mat.copy();
            if (detection.objects && detection.objects.length > 0) {
                detection.objects
                    .forEach(face => copy.drawRectangle(face, new cv.Vec(0, 255, 0), 2, cv.LINE_8));
            } else {
                throw new Error('noface');
            }
            return copy;
        });
}

function matToBase64(mat) {
    return cv.imencode('.jpg', mat).toString('base64');
}

function stripHeader(base64Image) {
    return base64Image.replace('data:image/jpeg;base64', '')
        .replace('data:image/png;base64', '');
}

function faceDetect(base64Image) {
    const img = stripHeader(base64Image);
    return base64ToMat(img)
        .then(detectFace)
        .then(matToBase64);
}

module.exports = { faceDetect, stripHeader };
