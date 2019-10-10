'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');
const config = require('config');

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: config.awsSdk.accessKeyId,
    secretAccessKey: config.awsSdk.secretAccessKey
});

AWS.config.update({ region: 'eu-west-1' });
AWS.config.setPromisesDependency(Promise);

const rekognition = new AWS.Rekognition();

function match(base64Image) {
    return rekognition.recognizeCelebrities({
        Image: {
            Bytes: Buffer.from(base64Image, 'base64')
        }
    }).promise()
        .then((resp) => {
            const result = {
                name: 'Celebrity Z Lister',
                confidence: 100,
                message: 'I\'m afraid your a nobody'
            };

            if (resp.CelebrityFaces && resp.CelebrityFaces.length) {
                result.name = resp.CelebrityFaces[0].Name;
                result.confidence = resp.CelebrityFaces[0].MatchConfidence;
                result.message = 'Well la de feckin\' da...';
            }
            return result;
        });
}

module.exports = {
    match
};
